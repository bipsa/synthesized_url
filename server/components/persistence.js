'use strict'

const isDevelopment = process.env.NODE_ENV !== 'production'
const { existsS3Sync, mkdirS3Sync, readFileS3Sync, writeFileS3Sync } = require('./aws')
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')

const scope = module.exports = {
  /**
   * Creates public folder useful for development and testing
   */
  createPublicFolderIfNotExists: async () => {
    if (isDevelopment) {
      if (!existsSync('./public')) {
        mkdirSync('./public')
      }
    }
    await scope.createDomainFileIfNotExist()
  },
  /**
   * Creates the domain file if not exists
   */
  createDomainFileIfNotExist: async () => {
    if (isDevelopment) {
      if (!existsSync('./public/domains.json')) {
        writeFileSync('./public/domains.json', JSON.stringify({}))
      }
    } else {
      if (!await existsS3Sync('domains.json')) {
        await writeFileS3Sync('domains.json', JSON.stringify({}))
      }
    }
  },
  /**
   * Reads the domain resource and returns its content
   */
  readDomainsFile: async () => {
    await scope.createPublicFolderIfNotExists()
    let domainsData = null
    if (isDevelopment) {
      const data = readFileSync('./public/domains.json')
      domainsData = JSON.parse(data)
    } else {
      domainsData = await readFileS3Sync('domains.json')
    }
    return domainsData
  },

  /**
   * Adds the domain and the short domain into the domains.js
   * @param {String} domain
   * @param {String} shrankDomain
   * @param {Object} fileContent Optional value, file content
   */
  addDomain: async (domain, shrankDomain, fileContent) => {
    if (isDevelopment) {
      if (!fileContent) {
        fileContent = await scope.readDomainsFile()
      }
      fileContent[domain] = shrankDomain
      writeFileSync('./public/domains.json', JSON.stringify(fileContent))
    } else {
      if (!fileContent) {
        fileContent = await scope.readDomainsFile()
      }
      fileContent[domain] = shrankDomain
      await writeFileS3Sync('domains.json', JSON.stringify(fileContent))
    }
    return fileContent
  },
  /**
   * Creates the domain folder and final url for the user
   * @param {String} domain
   * @param {String} url
   * @param {Object} shrankURL
   */
  createUrlIfNotExist: async (domain, url, shrankURL) => {
    if (isDevelopment) {
      const folder = `./public/${domain}`
      if (!existsSync(folder)) {
        mkdirSync(folder)
      }
      let content = {}
      if (!existsSync(`${folder}/urls.json`)) {
        content[url] = shrankURL
      } else {
        const data = readFileSync(`${folder}/urls.json`)
        content = JSON.parse(data)
        if (!content[url]) {
          content[url] = shrankURL
        } else {
          shrankURL = content[url]
        }
      }
      if (!existsSync(`${folder}/${shrankURL}`)) {
        mkdirSync(`${folder}/${shrankURL}`)
        await scope.addURLStatus(`${domain}/${shrankURL}`)
        await scope.addURLStats(`${domain}/${shrankURL}`)
      }
      writeFileSync(`${folder}/urls.json`, JSON.stringify(content))
      return content[url]
    } else {
      const folder = `${domain}`
      if (!await existsS3Sync(folder)) {
        await mkdirS3Sync(folder)
      }
      let content = {}
      if (!await existsS3Sync(`${folder}/urls.json`)) {
        content[url] = shrankURL
      } else {
        content = await readFileS3Sync(`${folder}/urls.json`)
        if (!content[url]) {
          content[url] = shrankURL
        } else {
          shrankURL = content[url]
        }
      }
      if (!await existsS3Sync(`${folder}/${shrankURL}`)) {
        await mkdirS3Sync(`${folder}/${shrankURL}`)
        await scope.addURLStatus(`${domain}/${shrankURL}`)
        await scope.addURLStats(`${domain}/${shrankURL}`)
      }
      await writeFileS3Sync(`${folder}/urls.json`, JSON.stringify(content))
      return content[url]
    }
  },
  /**
   * Gets the shark url from the given domain and url
   */
  getShrinkURL: async (domain, shrankDomain, url, shrankURL, persistedDomains) => {
    let internalPath = null
    if (persistedDomains) {
      persistedDomains = await scope.readDomainsFile()
    }
    if (!persistedDomains[domain]) {
      await scope.addDomain(domain, shrankDomain, persistedDomains)
    } else {
      shrankDomain = persistedDomains[domain]
    }
    internalPath = await scope.createUrlIfNotExist(shrankDomain, url, shrankURL)
    return `${shrankDomain}/${internalPath}`
  },
  /**
   * Adds the url status to the path
   * @param {String} url
   */
  addURLStatus: async (url) => {
    if (isDevelopment) {
      const folder = `./public/${url}`
      if (!existsSync(folder)) {
        mkdirSync(folder)
      }
      writeFileSync(`${folder}/status.json`, JSON.stringify({
        available: true
      }))
    } else {
      const folder = `${url}`
      if (!await existsS3Sync(folder)) {
        await mkdirS3Sync(folder)
      }
      await writeFileS3Sync(`${folder}/status.json`, JSON.stringify({
        available: true
      }))
    }
  },
  /**
   * This method changes the url status
   * @param {String} url
   * @param {Boolean} available
   */
  changeURLStatus: async (url, available) => {
    if (isDevelopment) {
      const statusFile = `./public/${url}/status.json`
      if (existsSync(statusFile)) {
        writeFileSync(statusFile, JSON.stringify({
          available
        }))
      }
    } else {
      const statusFile = `${url}/status.json`
      if (await existsS3Sync(statusFile)) {
        await writeFileS3Sync(statusFile, JSON.stringify({
          available
        }))
      }
    }
    return available
  },
  /**
   * Returns the status of the given path
   * @param {String} url
   * @returns {Boolean}
   */
  getURLStatus: async (url) => {
    let status = false
    if (isDevelopment) {
      const statusFile = `./public/${url}/status.json`
      if (existsSync(statusFile)) {
        const data = readFileSync(statusFile)
        const content = JSON.parse(data)
        status = content.available
      }
    } else {
      const statusFile = `${url}/status.json`
      if (await existsS3Sync(statusFile)) {
        const content = await readFileS3Sync(statusFile)
        status = content.available
      }
    }
    return status
  },
  /**
   * Adds the stats for the given shorten URL
   * @param {String} url
   */
  addURLStats: async (url) => {
    if (isDevelopment) {
      const folder = `./public/${url}`
      writeFileSync(`${folder}/stats.json`, JSON.stringify({
        total: 0,
        visits: []
      }))
    } else {
      const folder = `${url}`
      await writeFileS3Sync(`${folder}/stats.json`, JSON.stringify({
        total: 0,
        visits: []
      }))
    }
  },
  /**
   * Get url stats from the given url
   * @param {String} url
   */
  getURLStats: async (url) => {
    let stats = null
    if (isDevelopment) {
      const statsFile = `./public/${url}/stats.json`
      if (existsSync(statsFile)) {
        const data = readFileSync(statsFile)
        stats = JSON.parse(data)
      }
    } else {
      const statsFile = `${url}/stats.json`
      if (await existsS3Sync(statsFile)) {
        stats = await readFileS3Sync(statsFile)
      }
    }
    return stats
  },
  /**
   * This method adds a visit to a given url
   * @param {String} url
   * @param {Object} meta
   */
  addURLVisit: async (url, meta) => {
    let stats = null
    if (isDevelopment) {
      const statsFile = `./public/${url}/stats.json`
      if (existsSync(statsFile)) {
        const data = readFileSync(statsFile)
        stats = JSON.parse(data)
        stats.total = stats.total + 1
        stats.visits.push(meta)
        writeFileSync(statsFile, JSON.stringify(stats))
      }
    } else {
      const statsFile = `${url}/stats.json`
      if (await existsS3Sync(statsFile)) {
        stats = await readFileS3Sync(statsFile)
        stats.total = stats.total + 1
        stats.visits.push(meta)
        await writeFileS3Sync(statsFile, JSON.stringify(stats))
      }
    }
    return stats
  },
  getHiddenURL: async (url) => {
    let finalURL = null
    if (isDevelopment) {
      const urlsPath = `./public/${url}/../urls.json`
      if (existsSync(urlsPath)) {
        const data = readFileSync(urlsPath)
        const urls = JSON.parse(data)
        for (const property in urls) {
          // This need to be perfected, due to a weak validation
          if (url.indexOf(urls[property]) !== -1) {
            finalURL = property
            break
          }
        }
      }
    } else {
      const urlsPath = `${url.split('/')[0]}/urls.json`
      if (await existsS3Sync(urlsPath)) {
        const urls = await readFileS3Sync(urlsPath)
        for (const property in urls) {
          // This need to be perfected, due to a weak validation
          if (url.indexOf(urls[property]) !== -1) {
            finalURL = property
            break
          }
        }
      }
    }
    return finalURL
  }
}

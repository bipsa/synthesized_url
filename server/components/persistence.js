'use strict'

const isDevelopment = process.env.NODE_ENV !== 'production'
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')

const scope = module.exports = {
  /**
   * Creates public folder useful for development and testing
   */
  createPublicFolderIfNotExists: () => {
    if (isDevelopment) {
      if (!existsSync('./public')) {
        mkdirSync('./public')
      }
    }
    scope.createDomainFileIfNotExist()
  },
  /**
   * Creates the domain file if not exists
   */
  createDomainFileIfNotExist: () => {
    if (isDevelopment) {
      if (!existsSync('./public/domains.json')) {
        writeFileSync('./public/domains.json', JSON.stringify({}))
      }
    }
  },
  /**
   * Reads the domain resource and returns its content
   */
  readDomainsFile: () => {
    scope.createPublicFolderIfNotExists()
    let domainsData = null
    if (isDevelopment) {
      const data = readFileSync('./public/domains.json')
      domainsData = JSON.parse(data)
    }
    return domainsData
  },

  /**
   * Adds the domain and the short domain into the domains.js
   * @param {String} domain
   * @param {String} shrankDomain
   * @param {Object} fileContent Optional value, file content
   */
  addDomain: (domain, shrankDomain, fileContent) => {
    if (isDevelopment) {
      if (!fileContent) {
        fileContent = scope.readDomainsFile()
      }
      fileContent[domain] = shrankDomain
      writeFileSync('./public/domains.json', JSON.stringify(fileContent))
    }
    return fileContent
  },
  /**
   * Creates the domain folder and final url for the user
   * @param {String} domain
   * @param {String} url
   * @param {Object} shrankURL
   */
  createUrlIfNotExist: (domain, url, shrankURL) => {
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
        scope.addURLStatus(`${domain}/${shrankURL}`)
        scope.addURLStats(`${domain}/${shrankURL}`)
      }
      writeFileSync(`${folder}/urls.json`, JSON.stringify(content))
      return content[url]
    }
  },
  /**
   * Gets the shark url from the given domain and url
   */
  getShrinkURL: (domain, shrankDomain, url, shrankURL) => {
    const persistedDomains = scope.readDomainsFile()
    let internalPath = null
    if (!persistedDomains[domain]) {
      scope.addDomain(domain, shrankDomain, persistedDomains)
    } else {
      shrankDomain = persistedDomains[domain]
    }
    internalPath = scope.createUrlIfNotExist(shrankDomain, url, shrankURL)
    return `${shrankDomain}/${internalPath}`
  },
  /**
   * Adds the url status to the path
   * @param {String} url
   */
  addURLStatus: (url) => {
    if (isDevelopment) {
      const folder = `./public/${url}`
      if (!existsSync(folder)) {
        mkdirSync(folder)
      }
      writeFileSync(`${folder}/status.json`, JSON.stringify({
        available: true
      }))
    }
  },
  /**
   * This method changes the url status
   * @param {String} url
   * @param {Boolean} available
   */
  changeURLStatus: (url, available) => {
    if (isDevelopment) {
      const statusFile = `./public/${url}/status.json`
      if (existsSync(statusFile)) {
        writeFileSync(statusFile, JSON.stringify({
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
  getURLStatus: (url) => {
    let status = false
    if (isDevelopment) {
      const statusFile = `./public/${url}/status.json`
      if (existsSync(statusFile)) {
        const data = readFileSync(statusFile)
        const content = JSON.parse(data)
        status = content.available
      }
    }
    return status
  },
  /**
   * Adds the stats for the given shorten URL
   * @param {String} url
   */
  addURLStats: (url) => {
    if (isDevelopment) {
      const folder = `./public/${url}`
      writeFileSync(`${folder}/stats.json`, JSON.stringify({
        total: 0,
        visits: []
      }))
    }
  },
  /**
   * Get url stats from the given url
   * @param {String} url
   */
  getURLStats: (url) => {
    let stats = null
    if (isDevelopment) {
      const statsFile = `./public/${url}/stats.json`
      if (existsSync(statsFile)) {
        const data = readFileSync(statsFile)
        stats = JSON.parse(data)
      }
    }
    return stats
  },
  /**
   * This method adds a visit to a given url
   * @param {String} url
   * @param {Object} meta
   */
  addURLVisit: (url, meta) => {
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
    }
    return stats
  },
  getHiddenURL: (url) => {
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
    }
    return finalURL
  }
}

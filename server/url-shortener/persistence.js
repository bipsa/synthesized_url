'use strict'

const {
  existsS3Sync,
  mkdirS3Sync, readFileS3Sync,
  writeFileS3Sync
} = require('./aws')
const { existsSync, mkdirSync } = require('fs')

const isDevelopment = process.env.NODE_ENV !== 'production'

/**
 * Creates public folder useful for development and testing
 */
const createPublicFolderIfNotExists = async () => {
  if (isDevelopment) {
    if (!existsSync('./public')) {
      mkdirSync('./public')
    }
  }
  await createDomainFileIfNotExist()
}

/**
 * Creates the domain file if not exists
 */
const createDomainFileIfNotExist = async () => {
  if (!await existsS3Sync('domains.json')) {
    await writeFileS3Sync('domains.json', JSON.stringify({}))
  }
}

/**
 * Reads the domain resource and returns its content
 * @param [{String}] domain Optional value to look for the url or domain file
 */
const readDomainsFile = async (domain) => {
  await createPublicFolderIfNotExists()
  let domainsData = null
  const path = (!domain) ? 'domains.json' : `${domain}/urls.json`
  if (await existsS3Sync(path)) {
    const data = await readFileS3Sync(path)
    domainsData = JSON.parse(data)
  }
  return domainsData
}

/**
 * Adds the domain and the short domain into the domains.js
 * @param {String} domain
 * @param {String} shrankDomain
 * @param {Object} fileContent Optional value, file content
 */
const addDomain = async (domain, shrankDomain, fileContent) => {
  if (!fileContent) {
    fileContent = await readDomainsFile()
  }
  fileContent[domain] = shrankDomain
  await writeFileS3Sync('domains.json', JSON.stringify(fileContent))
  return fileContent
}

/**
 * Creates the domain folder and final url for the user
 * @param {String} domain
 * @param {String} url
 * @param {Object} shrankURL
 */
const createUrlIfNotExist = async (domain, url, shrankURL) => {
  const folder = `${domain}`
  if (!await existsS3Sync(folder)) {
    await mkdirS3Sync(folder)
  }
  let content = {}
  if (!await existsS3Sync(`${folder}/urls.json`)) {
    content[url] = shrankURL
  } else {
    const data = await readFileS3Sync(`${folder}/urls.json`)
    content = JSON.parse(data)
    if (!content[url]) {
      content[url] = shrankURL
    } else {
      shrankURL = content[url]
    }
  }
  if (!await existsS3Sync(`${folder}/${shrankURL}`)) {
    await mkdirS3Sync(`${folder}/${shrankURL}`)
    await addURLStatus(`${domain}/${shrankURL}`)
    await addURLStats(`${domain}/${shrankURL}`)
  }
  await writeFileS3Sync(`${folder}/urls.json`, JSON.stringify(content))
  return content[url]
}

/**
 * Gets the shark url from the given domain and url
 */
const getShrinkURL = async (domain, shrankDomain, url, shrankURL, persistedDomains) => {
  let internalPath = null
  if (persistedDomains) {
    persistedDomains = await readDomainsFile()
  }
  if (!persistedDomains[domain]) {
    await addDomain(domain, shrankDomain, persistedDomains)
  } else {
    shrankDomain = persistedDomains[domain]
  }
  internalPath = await createUrlIfNotExist(shrankDomain, url, shrankURL)
  return `${shrankDomain}/${internalPath}`
}

/**
 * Adds the url status to the path
 * @param {String} url
 */
const addURLStatus = async (url) => {
  const folder = `${url}`
  if (!await existsS3Sync(folder)) {
    await mkdirS3Sync(folder)
  }
  await writeFileS3Sync(`${folder}/status.json`, JSON.stringify({
    available: true
  }))
}

/**
 * This method changes the url status
 * @param {String} url
 * @param {Boolean} available
 */
const changeURLStatus = async (url, available) => {
  const statusFile = `${url}/status.json`
  if (await existsS3Sync(statusFile)) {
    await writeFileS3Sync(statusFile, JSON.stringify({
      available
    }))
  }
  return available
}

/**
 * Returns the status of the given path
 * @param {String} url
 * @returns {Boolean}
 */
const getURLStatus = async (url) => {
  let status = false
  const statusFile = `${url}/status.json`
  if (await existsS3Sync(statusFile)) {
    const data = await readFileS3Sync(statusFile)
    const content = JSON.parse(data)
    status = content.available
  }
  return status
}

/**
 * Adds the stats for the given shorten URL
 * @param {String} url
 */
const addURLStats = async (url) => {
  const folder = `${url}`
  await writeFileS3Sync(`${folder}/stats.json`, JSON.stringify({
    total: 0,
    visits: []
  }))
}

/**
 * Get url stats from the given url
 * @param {String} url
 */
const getURLStats = async (url) => {
  let stats = null
  const statsFile = `${url}/stats.json`
  if (await existsS3Sync(statsFile)) {
    const data = await readFileS3Sync(statsFile)
    stats = JSON.parse(data)
  }
  return stats
}

/**
 * This method adds a visit to a given url
 * @param {String} url
 * @param {Object} meta
 */
const addURLVisit = async (url, meta) => {
  let stats = null
  const statsFile = `${url}/stats.json`
  if (await existsS3Sync(statsFile)) {
    const data = await readFileS3Sync(statsFile)
    stats = JSON.parse(data)
    stats.total = stats.total + 1
    stats.visits.push(meta)
    await writeFileS3Sync(statsFile, JSON.stringify(stats))
  }
  return stats
}

const getHiddenURL = async (url) => {
  let finalURL = null
  const urlsPath = `${url.split('/')[0]}/urls.json`
  if (await existsS3Sync(urlsPath)) {
    const data = await readFileS3Sync(urlsPath)
    const urls = JSON.parse(data)
    for (const property in urls) {
      // This need to be perfected, due to a weak validation
      if (url.indexOf(urls[property]) !== -1) {
        finalURL = property
        break
      }
    }
  }
  return finalURL
}

module.exports = {
  createPublicFolderIfNotExists,
  createDomainFileIfNotExist,
  readDomainsFile,
  addDomain,
  createUrlIfNotExist,
  getShrinkURL,
  addURLStatus,
  changeURLStatus,
  getURLStatus,
  addURLStats,
  getURLStats,
  addURLVisit,
  getHiddenURL
}

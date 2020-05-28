'use strict'

const {
  getShrinkURL, getURLStatus, getURLStats,
  addURLVisit, changeURLStatus, getHiddenURL, readDomainsFile
} = require('./persistence')

/**
 * This method generates a string with the given complexity
 * @param {[Integer]} complexity Optional value to define the complexity the default is 3 (62^3 == 238328 options)
 * @returns {String}
 */
const random = (complexity) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
  let index = 0
  let encodedString = ''
  if (!complexity) {
    complexity = 3
  }
  while (index < complexity) {
    encodedString = `${encodedString}${alphabet[Math.floor(Math.random() * alphabet.length)]}`
    index++
  }
  return encodedString
}

const getURL = async (url) => {
  return await getHiddenURL(url)
}

const statusURL = async (url) => {
  return await getURLStatus(url)
}

const changeStatusURL = async (url, status) => {
  return await changeURLStatus(url, status)
}

const statsURL = async (url) => {
  return await getURLStats(url)
}

const visitURL = async (url, ip) => {
  const response = await addURLVisit(url, {
    ip,
    date: new Date()
  })
  return response
}

/**
 * Create and create generate a unique value
 * @param {Object} options
 */
const createAndValidateValue = (options) => {
  let shrankValue = null
  // This validation adds 3844 options
  let complexity = 2
  let triesCounter = 0
  // Looking for a valid name, computation time defined by the number of domains stored.
  while (shrankValue === null) {
    const tempDomain = `${random(complexity)}`
    let found = false
    for (const key in options) {
      if (options[key] === tempDomain) {
        found = true
      }
    }
    // Evaluating if the key was found or not, the method increments the complexity every 5 tries
    // If the complexity is higher than 5 you'll get a warning about start thinking on a
    // different method to store the URL
    if (!found) {
      shrankValue = tempDomain
    } else {
      triesCounter++
      if (triesCounter % 5 === 0) {
        complexity++
      }
      if (complexity > 5) {
        // TODO The warning is fine now but we need to properly handle this limit.
        console.warn('You better be thinking of a different method to store and generate URLs. The URLs have are becoming big.')
      }
    }
  }
  return shrankValue
}

/**
 * This method shrinks the given URL and returns its value
 * @param {String} url
 */
const shrinkURL = async (url) => {
  const urlPartsRegex = /^http.(.*)(\/\/)(.+(.*).(\.)(.{1,3}))(\/|.*$)(.*)/
  const parts = url.match(urlPartsRegex)
  let finalPath = null
  let shrankDomain = null
  let shrankUrl = null
  let domain = ''
  if (parts) {
    if (parts.length > 2) {
      domain = parts[3].replace(/\//g, '')
      const persistedDomains = await readDomainsFile()
      if (!persistedDomains[domain]) {
        shrankDomain = createAndValidateValue(persistedDomains)
      } else {
        shrankDomain = persistedDomains[domain]
      }
      shrankUrl = random(2)
      const persistedUrls = await readDomainsFile(shrankDomain)
      if (persistedUrls) {
        shrankUrl = createAndValidateValue(persistedUrls)
      }
      finalPath = await getShrinkURL(domain, shrankDomain, url, shrankUrl, persistedDomains)
    }
  }
  return finalPath
}

module.exports = {
  random,
  getURL,
  statusURL,
  changeStatusURL,
  statsURL,
  visitURL,
  shrinkURL,
  createAndValidateValue
}

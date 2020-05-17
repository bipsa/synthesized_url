'use strict'

const {
  getShrinkURL, getURLStatus, getURLStats,
  addURLVisit, changeURLStatus, getHiddenURL
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

module.exports = {
  getURL: async (url) => {
    return await getHiddenURL(url)
  },
  statusURL: async (url) => {
    return await getURLStatus(url)
  },
  changeStatusURL: async (url, status) => {
    return await changeURLStatus(url, status)
  },
  statsURL: async (url) => {
    return await getURLStats(url)
  },
  visitURL: async (url, ip) => {
    const response = await addURLVisit(url, {
      ip,
      date: new Date()
    })
    return response
  },
  shrinkURL: async (url) => {
    const urlPartsRegex = /^http.(.*)(\/\/)(.+(.*).(\.)(.{1,3}))(\/|.*$)(.*)/
    const parts = url.match(urlPartsRegex)
    let finalPath = null
    let shrankDomain = null
    let domain = ''
    if (parts) {
      if (parts.length > 2) {
        const domainPart = parts[3].split('.')
        shrankDomain = `${random()}`
        if (domainPart.length > 2) {
          domain = `${domainPart[1]}.${domainPart[2]}`
        } else {
          domain = `${domainPart[0]}.${domainPart[1]}`
        }
        finalPath = await getShrinkURL(domain, shrankDomain, url, random())
      }
    }
    return finalPath
  }
}

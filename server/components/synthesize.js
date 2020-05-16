'use strict'

const {
  getShrinkURL, getURLStatus, getURLStats,
  addURLVisit, changeURLStatus
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
  statusURL: (url) => {
    return getURLStatus(url)
  },
  changeStatusURL: (url, status) => {
    return changeURLStatus(url, status)
  },
  statsURL: (url) => {
    return getURLStats(url)
  },
  visit: (url) => {
    return addURLVisit(url, {
      ip: '0.0.0.1',
      date: new Date()
    })
  },
  shrinkURL: (url) => {
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
        finalPath = getShrinkURL(domain, shrankDomain, url, random())
      }
    }
    return finalPath
  }
}

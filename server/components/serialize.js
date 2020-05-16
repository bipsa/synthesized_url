'use strict'

const { getShrankURL, getURLStatus, getURLStats, addURLVisit } = require('./persistence')

/**
 * This method generates a string with the given complexity
 * @param {[Integer]} complexity Optional value to define the complexity the default is 3 (62^3 - 238328 options)
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

/**
 * This method encodes a url and gives a unique id
 */
module.exports = (url) => {
  const urlPartsRegex = /^http.(.*)(\/\/)(.+(.*).(\.)(.{1,3}))(\/|.$)(.*)/
  const parts = url.match(urlPartsRegex)
  const urlCompressed = null
  let shrankDomain = null
  let domain = ''
  if (parts.length > 2) {
    const domainPart = parts[3].split('.')
    shrankDomain = `${random()}`
    if (domainPart.length > 2) {
      domain = `${domainPart[1]}.${domainPart[2]}`
    } else {
      domain = `${domainPart[0]}.${domainPart[1]}`
    }
  }
  const finalPath = getShrankURL(domain, shrankDomain, url, random())
  addURLVisit(finalPath, {
    ip: '0.0.0.1',
    date: new Date()
  })
  console.log('>>>>>????', finalPath, getURLStatus(finalPath), getURLStats(finalPath))
  return urlCompressed
}

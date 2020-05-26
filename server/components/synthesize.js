'use strict'

const {
  getShrinkURL, getURLStatus, getURLStats,
  addURLVisit, changeURLStatus, getHiddenURL, readDomainsFile
} = require('./persistence')


const scope = module.exports = {
  /**
   * This method generates a string with the given complexity
   * @param {[Integer]} complexity Optional value to define the complexity the default is 3 (62^3 == 238328 options)
   * @returns {String}
   */
   random: (complexity) => {
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
  },
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
        if (domainPart.length > 2) {
          domain = `${domainPart[1]}.${domainPart[2]}`
        } else {
          domain = `${domainPart[0]}.${domainPart[1]}`
        }
        const persistedDomains = await readDomainsFile()
        if (!persistedDomains[domain]) {
          //This validation adds 3844 more options 
          let complexity = 2
          let triesCounter = 0
          // Looking for a valid name, computation time defined by the number of domains stored.
          while (shrankDomain === null) {
            let tempDomain = `${scope.random(complexity)}`
            let found = false
            for (let key in persistedDomains){
              if (persistedDomains[key] === tempDomain) {
                found = true
              }
            }
            // Evaluating if the key was found or not, the method increments the complexity every 5 tries
            // If the complexity is higher than 5 you'll get a warning about start thinking on a 
            // different method to store the URL
            if (!found){
              shrankDomain = tempDomain
            } else {
              triesCounter++
              if (triesCounter%5 === 0) {
                complexity++
              }
              if (complexity > 5) {
                console.warn('You better be thinking of a different method to store and generate URLs. The URLs have now become big.')
              }
            }
          }
        } else {
          shrankDomain = persistedDomains[domain]
        }
        finalPath = await getShrinkURL(domain, shrankDomain, url, scope.random(), persistedDomains)
      }
    }
    return finalPath
  }
}

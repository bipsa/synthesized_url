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
      }
      writeFileSync(`${folder}/urls.json`, JSON.stringify(content))
      return content[url]
    }
  },

  getShrankURL: (domain, shrankDomain, url, shrankURL) => {
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

  addStatus: (shrankDomain, shrankURL) => {

  },

  addDomainStat: (domain, meta) => {

  }
}

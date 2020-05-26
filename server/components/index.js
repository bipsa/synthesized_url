'use strict'

const {
  shrinkURL, statsURL, statusURL,
  changeStatusURL, visitURL, getURL
} = require('./synthesize')
const domain = process.env.domain || 'http://localhost:3000'

const scope = module.exports = {
  /**
   * This method validates a URL and returns if it is valid or not
   * @param {String} url
   * @returns {Boolean}
   */
  validateURL: (url) => {
    const regex = /^http.(.*)(\/\/)(.+(.*).(\.)(.{1,3}))(\/|.*$)(.*)/
    return regex.test(url)
  },
  /**
   * This method shortens the given URL and returns its value
   * @param {String} url
   * @returns {String}
   */
  shorten: async (url) => {
    let shorten = null
    if (scope.validateURL(url)) {
      shorten = await shrinkURL(url)
      url = `${domain}/${shorten}/`
    } else {
      url = null
    }
    return url
  },
  /**
   * This method gives the status for the given url
   * @param {String} url
   * @returns {Object}
   */
  status: (url) => {
    let status = null
    if (scope.validateURL(url)) {
      url = (url)
    }
    status = statusURL(url)
    return status
  },
  /**
   * This method gives the stats for the given url
   * @param {String} url
   * @returns {Object}
   */
  stats: async (url) => {
    let stats = null
    if (scope.validateURL(url)) {
      url = await shrinkURL(url)
    }
    stats = await statsURL(url)
    return stats
  },
  /**
   * Disables the given URL if it is found
   * @param {String} url
   */
  disable: async (url) => {
    let status = null
    if (scope.validateURL(url)) {
      url = await shrinkURL(url)
    }
    status = await changeStatusURL(url, false)
    return status
  },
  /**
   * If the URL is created and it is disabled, this method enables the URL.
   * @param {String} url
   */
  enable: async (url) => {
    let status = null
    if (scope.validateURL(url)) {
      url = await shrinkURL(url)
    }
    status = await changeStatusURL(url, true)
    return status
  },
  /**
   * If the URL is created and it is disabled, this method enables the URL.
   * @param {String} url
   */
  view: async (url, ip) => {
    let stats = null
    if (scope.validateURL(url)) {
      url = await shrinkURL(url)
    }
    stats = await visitURL(url, ip)
    if (stats) {
      stats.url = await getURL(url)
    }
    return stats
  }
}

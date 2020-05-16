'use strict'

const {
  shrinkURL, statsURL, statusURL,
  changeStatusURL
} = require('./synthesize')
const domain = process.env.domain || 'https://local.sh'

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
  shorten: (url) => {
    let shorten = null
    if (scope.validateURL(url)) {
      shorten = shrinkURL(url)
    }
    return `${domain}/${shorten}/`
  },
  /**
   * This method gives the status for the given url
   * @param {String} url
   * @returns {Object}
   */
  status: (url) => {
    let status = null
    if (scope.validateURL(url)) {
      url = shrinkURL(url)
    }
    status = statusURL(url)
    return status
  },
  /**
   * This method gives the stats for the given url
   * @param {String} url
   * @returns {Object}
   */
  stats: (url) => {
    let stats = null
    if (scope.validateURL(url)) {
      url = shrinkURL(url)
    }
    stats = statsURL(url)
    return stats
  },
  /**
   * Disables the given URL if it is found
   * @param {String} url
   */
  disable: (url) => {
    let status = null
    if (scope.validateURL(url)) {
      url = shrinkURL(url)
    }
    status = changeStatusURL(url, false)
    return status
  },
  /**
   * If the URL is created and it is disabled, this method enables the URL.
   * @param {String} url
   */
  enable: (url) => {
    let status = null
    if (scope.validateURL(url)) {
      url = shrinkURL(url)
    }
    status = changeStatusURL(url, true)
    return status
  }
}

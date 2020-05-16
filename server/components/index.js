'use strict'

const SerializeURL = require('./serialize')

const scope = module.exports = {
  /**
   * This method validates a URL and returns if it is valid or not
   * @param {String} url
   * @returns {Boolean}
   */
  validateURL: (url) => {
    const regex = /^http.(.*).(\/\/).+(.*)(\.)(.{1,3}).(\/|.$)/
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
      shorten = 'hola como estoy..'
      SerializeURL(url)
    }
    return shorten
  },
  /**
   * This method gives the stats for the given url
   * @param {String} url
   * @returns {Object}
   */
  stats: (url) => {
    return {

    }
  },
  /**
   * Disables the given URL if it is found
   * @param {String} url
   */
  disable: (url) => {
    return url
  },
  /**
   * If the URL is created and it is disabled, this method enables the URL.
   * @param {String} url
   */
  enable: (url) => {

  }
}

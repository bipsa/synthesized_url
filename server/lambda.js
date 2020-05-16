'use strict'

const { shorten, stats } = require('./components')

module.exports.handler = (event, context) => {
  shorten('https://www.skillshare.com/classes/Watercolor-in-the-Woods-A-Beginners-Guide-to-Painting-the-Natural-World/361593593?via=lih-promo-banner-placement1')
  stats('hola-mundo')
}

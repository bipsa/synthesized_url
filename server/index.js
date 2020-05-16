'use strict'

const { shorten, stats, status, disable, enable } = require('./components')

console.log(shorten('https://www.skillshare.com/classes/Watercolor-in-the-Woods-A-Beginners-Guide-to-Painting-the-Natural-World/361593593?via=lih-promo-banner-placement1'))
console.log(shorten('https://skillshare.com/'))
console.log(shorten('https://skillshare.com'))
console.log(shorten('https://skillshare.sh'))
console.log('???', stats('hola-mundo'))
console.log('???', stats('AYR/NUM'), status('AYR/NUM'), enable('AYR/NUM'))
console.log('???', stats('https://skillshare.com/'), disable('https://skillshare.com/'))

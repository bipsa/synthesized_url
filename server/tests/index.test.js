'use strict'

const { validateURL } = require('../url-shortener')

test('Validate a valid url', () => {
  expect(validateURL('https://www.skillshare.com/')).toBe(true)
})
test('Validate a long but valid url', () => {
  expect(validateURL('https://www.skillshare.com/classes/Getting-Started-with-Email-Marketing-Learn-with-Mailchimp/133293390?via=logged-in-home-row-recommended')).toBe(true)
})
test('Validate a weird but valid url', () => {
  expect(validateURL('https://another.valid.skillshare.com/')).toBe(true)
})
test('Validate an invalid url', () => {
  expect(validateURL('htt')).toBe(false)
})

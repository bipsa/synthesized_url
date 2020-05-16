'use strict'

const { shrinkURL } = require('./synthesize')

test('Evaluate a valid', () => {
  expect(shrinkURL('https://www.skillshare.com/home')).toMatch(/^(.{1,3})(\/)(.{1,3})$/)
})
test('Evaluate an invalid url', () => {
  expect(shrinkURL('hola como estas')).toBe(null)
})

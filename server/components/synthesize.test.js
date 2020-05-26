'use strict'

const { shrinkURL } = require('./synthesize')

test('Evaluate a valid', async () => {
  expect(await shrinkURL('https://www.skillshare.com/home')).toMatch(/^(.{1,5})(\/)(.{1,5})$/)
})
test('Evaluate an invalid url', async () => {
  expect(await shrinkURL('hola como estas')).toBe(null)
})

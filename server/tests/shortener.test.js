'use strict'

const { shrinkURL, createAndValidateValue } = require('../url-shortener/shortener')

test('Evaluate a valid', async () => {
  expect(await shrinkURL('https://www.skillshare.com/home')).toMatch(/^(.{1,5})(\/)(.{1,5})$/)
})

test('Evaluate an invalid url', async () => {
  expect(await shrinkURL('hola como estas')).toBe(null)
})

test('Create and validate shorted value', async () => {
  expect(await createAndValidateValue({
  })).toHaveLength(2)
})

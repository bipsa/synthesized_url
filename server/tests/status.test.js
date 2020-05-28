'use strict'

const {
  shorten, stats, status,
  disable, enable, view
} = require('../url-shortener')

let testUrl = 'https://www.skillshare.com/workshops/910?via=logged-in-home-workshops-row'

async function normalizeUrl(){
  let shortUrl = await shorten(testUrl)
  const parts = shortUrl.split('localhost:3000')
  const normalizedURL = `${parts[1].split('/')[1]}/${parts[1].split('/')[2]}`
  return normalizedURL
}

test('Status View', async () => {
  const currentStatus = await status(normalizeUrl())
  const response = await view(normalizeUrl(), '1.1.1')
  if (currentStatus){
    expect(testUrl).toBe(response.url)
  } else {
    expect(response).toBeDefined()
  }
})

test('View url Stats', async () => {
  const response = await stats(normalizeUrl())
  expect(response).toBeDefined()
})

test('Disable url', async () => {
  const response = await disable(normalizeUrl())
  expect(response).toBe(false)
})

test('Enable url', async () => {
  const response = await enable(normalizeUrl())
  expect(response).toBe(true)
})

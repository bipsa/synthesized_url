'use strict'

const {
  shorten, stats, status,
  disable, enable, view
} = require('./url-shortener')

const express = require('express')
const parser = require('body-parser')

const app = express()
const port = process.env.port || 3000

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

app.get(/^\/(.{1,3})\/(.{1,3})\/(?:\/(?=$))?$/i, async (request, res) => {
  const normalizedURL = `${request.params[0]}/${request.params[1]}`
  const isEnable = await status(normalizedURL)
  if (!isEnable) {
    res.status(400)
    return res.send({
      message: 'URL is not available.'
    })
  }
  const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress
  const response = await view(normalizedURL, ip)
  if (response) {
    res.redirect(response.url)
  } else {
    res.status(404)
    return res.send({
      message: 'URL was not found.'
    })
  }
})

app.get(/^\/(.{1,3})\/(.{1,3})\/stats\/?$/i, async (request, res) => {
  const normalizedURL = `${request.params[0]}/${request.params[1]}`
  const response = await stats(normalizedURL)
  if (response) {
    return res.send(response)
  }
  res.status(404)
  return res.send({
    message: 'URL was not found.'
  })
})

app.get(/^\/(.{1,3})\/(.{1,3})\/enable\/?$/i, async (request, res) => {
  const normalizedURL = `${request.params[0]}/${request.params[1]}`
  const response = await enable(normalizedURL)
  if (response !== null) {
    return res.send({
      response
    })
  }
  res.status(404)
  return res.send({
    message: 'URL was not found.'
  })
})

app.get(/^\/(.{1,3})\/(.{1,3})\/disable\/?$/i, async (request, res) => {
  const normalizedURL = `${request.params[0]}/${request.params[1]}`
  const response = await disable(normalizedURL)
  if (response !== null) {
    return res.send({
      response
    })
  }
  res.status(404)
  return res.send({
    message: 'URL was not found.'
  })
})

app.post('/shorten/', async (request, res) => {
  let response = {}
  if (!request.body.url) {
    res.status(400)
    response = {
      message: 'You need to provide a url.'
    }
  } else {
    res.status(200)
    const shortenURL = await shorten(request.body.url)
    if (shortenURL !== null) {
      response = {
        url: shortenURL
      }
    } else {
      res.status(400)
      response = {
        message: 'You need to provide a valid url.'
      }
    }
  }
  return res.send(response)
})

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}/`)
})

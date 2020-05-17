'use strict'

const { shorten, stats, view, status, enable, disable} = require('./components')

exports.handler = async (event, context, callback) => {
  const action = (event.path.params.path.action) ? event.path.params.path.action : null
  if (event.body) {
    const shortenURL = await shorten(event.body.url)
    if (shortenURL !== null) {
      return {
        url: shortenURL
      }
    }
  } else if (!event.body && !action) {
    const normalizedURL = `${event.path.params.path.domain}/${event.path.params.path.url}`
    const isEnable = await status(normalizedURL)
    if (!isEnable) {
      return {
        message: 'URL is not available.'
      }
    }
    const ip = event.headers['X-Forwarded-For']
    const response = await view(normalizedURL, ip)
    if (response) {
      callback(null, {
        statusCode: 302,
        headers: {
          Location: response.url,
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  } else if (action === 'stats') {
    const normalizedURL = `${event.path.params.path.domain}/${event.path.params.path.url}`
    const response = await stats(normalizedURL)
    if (response) {
      return response
    }
  } else if (action === 'enable') {
    const normalizedURL = `${event.path.params.path.domain}/${event.path.params.path.url}`
    const response = await enable(normalizedURL)
    if (response) {
      return {response}
    }
  } else if (action === 'disable') {
    const normalizedURL = `${event.path.params.path.domain}/${event.path.params.path.url}`
    const response = await disable(normalizedURL)
    if (response !== null) {
      return {
        response: response
      }
    }
  }
  return {
    event
  }
}

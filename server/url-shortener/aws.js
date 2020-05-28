'use strict'

const {
  existsSync, mkdirSync,
  readFileSync, writeFileSync
} = require('fs')
const AWS = require('aws-sdk')

AWS.config.region = 'us-east-1'

const isDevelopment = process.env.NODE_ENV !== 'production'
const basePath = (isDevelopment) ? './public/' : ''

const getS3ClientInstance = (path) => {
  const s3Client = new AWS.S3()
  const params = {
    Bucket: 'synthesized-url',
    Key: path
  }
  return {
    s3Client,
    params
  }
}

module.exports = {

  mkdirS3Sync: (path) => {
    path = `${basePath}${path}`
    return new Promise(resolve => {
      if (isDevelopment) {
        mkdirSync(path)
        resolve()
        return
      }
      const { s3Client, params } = getS3ClientInstance(path)
      params.ACL = 'public-read'
      s3Client.putObject(params, (err, data) => {
        if (err) {
          console.log(err)
        }
        resolve(data)
      })
    })
  },

  writeFileS3Sync: (path, content) => {
    path = `${basePath}${path}`
    return new Promise(resolve => {
      if (isDevelopment) {
        writeFileSync(path, content)
        resolve()
        return
      }
      const { s3Client, params } = getS3ClientInstance(path)
      params.Body = Buffer.from(content)
      params.ACL = 'public-read'
      s3Client.putObject(params, (err, data) => {
        if (err) {
          console.log(err)
        }
        resolve(data)
      })
    })
  },

  existsS3Sync: (path) => {
    path = `${basePath}${path}`
    return new Promise(resolve => {
      if (isDevelopment) {
        resolve(existsSync(path))
        return
      }
      const { s3Client, params } = getS3ClientInstance(path)
      s3Client.headObject(params, (err, data) => {
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  },

  readFileS3Sync: (path) => {
    path = `${basePath}${path}`
    return new Promise(resolve => {
      if (isDevelopment) {
        const response = readFileSync(path)
        resolve(response)
        return
      }
      const { s3Client, params } = getS3ClientInstance(path)
      s3Client.getObject(params, (err, data) => {
        if (err) {
          console.log(err)
        }
        if (data) {
          const response = data.Body.toString('utf-8')
          resolve(response)
        }
      })
    })
  }
}

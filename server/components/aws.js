'use strict'

const AWS = require('aws-sdk')
AWS.config.region = 'us-east-1'

module.exports = {
  mkdirS3Sync: (path) => {
    const s3Client = new AWS.S3()
    const params = {
      Bucket: 'synthesized-url',
      Key: path,
      ACL: 'public-read'
    }
    return new Promise(resolve => {
      s3Client.putObject(params, (err, data) => {
        if (err) {
          console.log(err)
        }
        resolve(data)
      })
    })
  },
  writeFileS3Sync: (path, content) => {
    const s3Client = new AWS.S3()
    const params = {
      Bucket: 'synthesized-url',
      Key: path,
      Body: Buffer.from(content),
      ACL: 'public-read'
    }
    return new Promise(resolve => {
      s3Client.putObject(params, (err, data) => {
        if (err) {
          console.log(err)
        }
        resolve(data)
      })
    })
  },
  existsS3Sync: (path) => {
    const s3Client = new AWS.S3()
    const params = {
      Bucket: 'synthesized-url',
      Key: path
    }
    return new Promise(resolve => {
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
    const s3Client = new AWS.S3()
    const params = {
      Bucket: 'synthesized-url',
      Key: path
    }
    return new Promise(resolve => {
      s3Client.getObject(params, (err, data) => {
        if (err) {
          console.log(err)
        }
        if (data) {
          const response = data.Body.toString('utf-8')
          resolve(JSON.parse(response))
        }
      })
    })
  }
}

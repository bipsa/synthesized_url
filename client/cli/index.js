'use strict';

const inquirer = require('inquirer')
const rest = require('unirest')
const args = process.argv.slice(2);

const questions = [
  {
    type: 'input',
    name: 'url',
    message: 'Please add the URL you want to shorten:'
  }
]

const request = (url, body, method, complete) => {
  const req = rest(method, url).headers({
    'Content-Type': 'application/json'
  }).send(JSON.stringify(body)).end((res) => { 
    complete(res.error, JSON.parse(res.raw_body))
  })
}

const shortenURL = (url) => {
  request('http://localhost:3000/shorten/', {
    url: url
  }, 'POST', (error, response) => {
    if (error) {
      console.log(response.message)
    } else {
      console.log(response.url)
    }
  })
}

const findArgument = (key) => {
  for (let i=0; i<args.length; i++) {
    if (args[i].trim() === key) {
      return true
    }
  }
  return false
}

const findValueForKey = (key) => {
  let value = null
  for (let i=0; i<args.length; i++) {
    if (args[i].trim() !== key) {
      value = args[i].trim()
    }
  }
  return value
}

if (!findArgument('--url')){
  inquirer.prompt(questions).then(async (answers) => {
    shortenURL(answers.url)
  })
} else {
  shortenURL(findValueForKey('--url'))
}


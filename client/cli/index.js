'use strict';

const inquirer = require('inquirer')
const rest = require('unirest')
const pluralize = require('pluralize')
const table = require('console.table')
const args = process.argv.slice(2)

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

const statsURL = (url) => {
  request(`${url}stats/`, {
    url: url
  }, 'GET', (error, response) => {
    if (!error) {
      console.log(`${url} has open ${response.total} ${pluralize('times', response.total)}.`)
      if (response.total > 0 ){
        if (response.visits.length > 2) {
          console.table(response.visits.slice(Math.max(response.visits.length - 2, 0)))
        }
      }
      console.log('View more...') 
    }
  })
}

const disableEnableURL = (url, enable) => {
  request(`${url}${(enable)?'enable':'disable'}/`, {
    url: url
  }, 'GET', (error, response) => {
    if (!error) {
      console.log(response)
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

if (findArgument('stats')){
  statsURL(findValueForKey('stats'))
} else if (findArgument('disable')) {
  disableEnableURL(findValueForKey('disable'), false)
} else if (findArgument('enable')) {
  disableEnableURL(findValueForKey('enable'), true)
} else if (!findArgument('shorten')) {
  inquirer.prompt(questions).then(async (answers) => {
    shortenURL(answers.url)
  })
} else if (findArgument('shorten')) {
  shortenURL(findValueForKey('shorten'))
}


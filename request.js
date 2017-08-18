const config = require('./config')
const apiUrl = 'https://api.github.com'
const request = require('request')
// const prListUri = '/repos/frontec/molaa-rest-api/pulls';

// const prReadyUri =
// '/search/issues?q=is:pr%20label:"Ready%20to%20Merge"%20repo:frontec/molaa-rest-api';

// const prSearchUri =
// '/search/issues?q=is:pr%20label:"Needs%20review"%20repo:frontec/molaa-rest-api';

const githubRequest = request.defaults({
  auth: {
    bearer: config.githubApiToken
  },
  headers: {
    'User-Agent': 'request'
  },
  baseUrl: apiUrl,
  json: true
})

module.exports = githubRequest

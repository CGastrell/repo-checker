const config = require('./config')
const githubRequest = require('./request')

module.exports = {
  check: (params, callback) => {
    githubRequest.get(
      {
        uri: `${config.searchUri}${params.repo}`
      },
      callback
    )
  }
}

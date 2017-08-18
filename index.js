const app = require('express')()
const srv = require('http').createServer(app)
const bodyParser = require('body-parser')
const repoChecker = require('./repo-checker')
const request = require('request')
const config = require('./config')
require('now-logs')('repo-checker2')

app.post('/', bodyParser.json(), (req, res/* , next */) => {
  if (!req.body || !req.body.repo || !req.body.channel) {
    console.log('lacks body')
    console.log(req.body)
    res.send('failure')
  }
  const checkOptions = {
    repo: req.body.repo,
    channel: req.body.channel
  }
  repoChecker.check(checkOptions, (err, res2, body) => {
    if (err) {
      console.log('error checking repo')
      console.log(err)
      console.log(body)
      res.send('failure')
    }
    // console.log(body)
    // body schema:
    //  total_count: int
    //  incomplete_results: boolean
    //  items: array
    const options = {
      pullRequests: body.items,
      repo: checkOptions.repo,
      channel: checkOptions.channel
    }
    if (body.total_count && body.total_count > 0) {
      return announceToSlack(options, (err2, result) => {
        if (err2) {
          console.log('error announcing')
          console.log(err2)
          return res.send(result)
        }
        console.log('all fine')
        res.send(result)
      })
    } else {
      console.log('something not right on github response')
      console.log(body)
      res.send('failure')
    }
  })
})

srv.listen(3000, () => {
  console.log('Listening on 3000')
})

function announceToSlack (options, callback) {
  const pullRequests = options.pullRequests || []
  if (!pullRequests || !pullRequests.length) {
    return callback(null, 'success')
  }

  const toBe = pullRequests.length > 1 ? 'are' : 'is'
  const prPlural = pullRequests.length > 1 ? 'requests' : 'request'
  const firstLiner = `O hai! There ${toBe} ${pullRequests.length} pull ${prPlural} waiting for code review`
  const urlList = pullRequests.map(pr => pr.html_url).join('\n')
  const msgBody = [
    firstLiner,
    '\n',
    urlList
  ]
  const payloadObject = {
    channel: options.channel,
    text: encodeURIComponent(msgBody.join('\n')),
    username: 'Totoro',
    icon_url: 'http://dermonutt.com.ar/images/totoro.png'
  }
  const payloadString = JSON.stringify(payloadObject)
  const payload = `payload=${payloadString}`
  request.post({ url: config.slackWebhookUrl, form: payload }, (err /* , res, body */) => {
    if (err) {
      return callback(err, 'failure')
    }
    return callback(null, 'success')
  })
}

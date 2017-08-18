const config = {
  githubApiToken: process.env.GITHUB_API_TOKEN,
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  searchUri: '/search/issues?q=is:pr%20is:open%20label:"Needs%20review"%20repo:'
}

module.exports = config

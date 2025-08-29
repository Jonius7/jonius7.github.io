// next.config.js

const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = ''
let basePath = ''

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  // If deploying to <username>.github.io (root), leave them empty
  //if (repo !== `${process.env.GITHUB_REPOSITORY.split('/')[0]}.github.io`) {
  //  assetPrefix = `/${repo}/`
  //  basePath = `/${repo}`
  //}
}

module.exports = {
  assetPrefix,
  basePath,
  output: 'export',      // required for npm run export
  trailingSlash: true,   // good for static hosting
}

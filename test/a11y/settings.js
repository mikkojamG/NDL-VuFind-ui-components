// Familiarize yourself with Pa11y configuration options: https://github.com/pa11y/pa11y#configuration

module.exports = {
  runners: ['htmlcs', 'axe'],
  ignore: [
    'page-has-heading-one',
    'bypass',
    'landmark-one-main',
    'region'
  ]
}

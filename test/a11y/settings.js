module.exports = {
  runners: ['htmlcs', 'axe'],
  rootElement: '.pl-c-main',
  ignore: [
    'page-has-heading-one',
    'html-has-lang',
    'document-title',
    'WCAG2AA.Principle3.Guideline3_1.3_1_1.H57.2',
    'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
    'bypass',
    'landmark-one-main',
    'region'
  ]
}

require('events').EventEmitter.defaultMaxListeners = 100

const path = require('path');
const pa11y = require('pa11y');
const fs = require('fs');

const patternlab = require('../patternlab-config.json');
const config = require('./settings');

const getMarkupFiles = (dir) => {
  return fs.readdirSync(dir).reduce((files, file) => {
    const name = path.join(dir, file);

    const isDirectory = fs.statSync(name).isDirectory();

    return isDirectory ? [...files, ...getMarkupFiles(name)] : [...files, name];
  }, []).filter((file) => {
    const name = path.join(dir, file);

    const isMarkupOnly = name.indexOf('.markup-only') > 0;
    const isPartial = name.indexOf('-_') > 0;

    return isMarkupOnly && !isPartial;
  });
}

const getIssues = async files => Promise.all(files.map(async (file) => {
  const results = await pa11y(file, config);

  const issues = results.issues;

  if (issues.length) {
    return {
      pattern: path.basename(file),
      issues: issues
    }
  }
}));

const trackIssues = async () => {
  try {
    const files = getMarkupFiles(path.resolve(patternlab.paths.public.patterns));

    const issues = await getIssues(files);

    console.dir(issues, { depth: null });
  } catch (error) {
    console.log(error);
  }
};

trackIssues();

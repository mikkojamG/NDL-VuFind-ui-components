const path = require('path');
const pa11y = require('pa11y');
const fs = require('fs');
const chalk = require('chalk');
const cliProgress = require('cli-progress');

const patternlab = require('../../patternlab-config.json');
const config = require('./settings');

const progress = new cliProgress.SingleBar({ clearOnComplete: true }, cliProgress.Presets.shades_classic);

const getPatterns = (directory) => {
  return fs.readdirSync(directory)
    .reduce((files, file) => {
      const name = path.join(directory, file);

      const isDirectory = fs.statSync(name).isDirectory();

      return isDirectory ? [...files, ...getPatterns(name)] : [...files, name];
    }, [])
    .filter((file) => {
      const name = path.join(directory, file);

      const isMarkupOnly = name.indexOf('.rendered') > 0;
      const isHelperPattern = name.indexOf('-_') > 0;

      return isMarkupOnly && !isHelperPattern;
    });
};

const asyncForEach = async (array, callback) => {
  for (const item of array) {
    await callback(item);
  }
};

const getPatternIssuesPromise = (files) => {
  return Promise.all(files.map(async (file) => {
    const results = await pa11y(file, config);

    progress.increment();

    const issues = results.issues;

    if (issues.length) {
      return {
        pattern: path.basename(file),
        issues: issues
      }
    }
  }));
};

const getPatternIssues = async (files) => {
  progress.start(files.length, 0);

  const issues = [];

  await asyncForEach(files, async (file) => {
    const results = await pa11y(file, config);

    const resultsIssues = results.issues;

    if (resultsIssues.length) {
      issues.push({ pattern: path.basename(file), issues: resultsIssues })
    }

    progress.increment();
  });

  progress.stop();

  return issues;
}

const getIssuesAmount = (issues) => {
  return issues.map((item) => {
    return item.issues.length;
  }).reduce((a, b) => a + b, 0);
}

const testForA11y = async () => {
  try {
    console.log(chalk.yellow('Starting a11y testing for patterns. Please wait..'))

    const files = getPatterns(path.resolve(patternlab.paths.public.patterns));

    const issues = await getPatternIssues(files);
    const issuesAmount = getIssuesAmount(issues);

    if (issues.length) {
      console.dir(issues, { depth: null });
    }

    console.log(chalk.green(`A11y testing finished successfully with ${issuesAmount} issues found.`));

  } catch (error) {
    console.log(error);

    console.log(chalk.red(`Something went wrong: ${error}`));
  }
};

testForA11y();

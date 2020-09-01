require('dotenv').config();
const config = require('./patternlab-config.json');
const helpers = require('./gulp-helpers');

const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync');
const fs = require('fs');
const chalk = require('chalk');
const exec = require('child_process').exec;
const util = require('util');
const asyncExec = util.promisify(require('child_process').exec);
const pipeExec = require('gulp-exec');
const tap = require('gulp-tap');

const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const replace = require('gulp-replace');

// Tasks
const cleanPublic = () => helpers.cleanDir(config.paths.public.root);
gulp.task(cleanPublic);

const patternLab = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(pipeExec('patternlab build --config ./patternlab-config.json'))
    .pipe(browserSync.stream());

};
gulp.task(patternLab);

const fonts = () => {
  const bootstrapFonts = `${process.env.THEMES_ROOT}/bootstrap3/css/fonts`;
  const finnaFonts = `${process.env.THEME_DIRECTORY}/css/fonts`;

  const dest = config.paths.public.fonts;

  return gulp
    .src([`${bootstrapFonts}/*`, `${finnaFonts}/*`])
    .pipe(gulp.dest(dest));
};
gulp.task(fonts);

const styles = () => {
  const source = config.paths.source.styles;
  const dest = config.paths.public.styles;

  return gulp
    .src(`${source}/*.less`)
    .pipe(less({
      modifyVars: {
        '@themePath': `../../../${process.env.THEMES_ROOT}`
      }
    }))
    .pipe(autoprefixer())
    .pipe(replace('../../../themes/finna2/css/fonts', '../fonts'))
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(styles);

const themeScripImports = async (file, t) => {
  const jsonConfig = await asyncExec(`php -r \'$config = include "${process.env.THEME_DIRECTORY}/theme.config.php"; echo json_encode($config);\'`);

  const config = JSON.parse(jsonConfig.stdout);
  let configJs = config.js;

  configJs.push(file.path);

  const newConfig = Object.assign({}, config);
  newConfig['js'] = configJs;

  console.log(JSON.stringify(newConfig));
}

const themeScripts = async () => {
  try {
    const source = `${config.paths.source.root}/components/**/*.js`;

    return gulp
      .src(source)
      .pipe(tap(themeScripImports));

  } catch (error) {
    console.log(error);
  }
};
gulp.task(themeScripts);

const scripts = () => {
  const source = config.paths.source.root;
  const dest = config.paths.public.js;

  return gulp
    .src([
      `${source}/js/finna.js`,
      `!${source}/js/vendor/*.js`,
      `${source}/components/**/*.js`,
      `${source}/js/patternlab/*.js`,
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(scripts);

const vendorScripts = () => {
  const vendor = `${config.paths.source.js}/vendor`;
  const dest = `${config.paths.public.js}/vendor`;

  return gulp
    .src(`${vendor}/*.js`)
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(vendorScripts);

const watchTask = () => {
  browserSync.init({
    server: {
      baseDir: config.paths.public.root
    },
    ghostMode: true,
    open: 'external',
    snippetOptions: {
      blacklist: ['/index.html', '/']
    }
  });

  gulp.watch(`${config.paths.source.styles}/**/*.less`, styles);
  gulp.watch(`${config.paths.source.patterns}**/*.less`, styles);

  gulp.watch(`${config.paths.source.js}/**/*.js`, scripts);
  gulp.watch(`${config.paths.source.patterns}**/*.js`, scripts);

  gulp.watch(`${config.paths.source.patterns}**/*.phtml`, patternLab);
  gulp.watch(`${config.paths.source.patterns}**/*.json`, patternLab);
};
gulp.task(watchTask);

const validateImportTargetFile = (file) => {
  return fs.readFile(file, (error, data) => {
    if (error) {
      throw error;
    }

    if (data.indexOf('Component imports start here') == -1 && data.indexOf('Component imports end here') == -1) {
      const errorMessage = `Not able to import to target file: ${file}. Make sure that file has required starting comment /* Component imports start here */ and ending comment /* Component imports end here */`;

      console.log(chalk.red(errorMessage));

      throw Error(errorMessage);
    }
  });
};

const checkImportTargetFile = async (file) => new Promise((resolve, reject) => {
  return fs.access(file, (error) => {
    if (error) {
      console.log(chalk.yellow(`${file} does not exist. Trying to create.`));

      const componentsFileContent = '/* Component imports start here */ \r\n/* Component imports end here */';

      return fs.writeFile(file, componentsFileContent, (err) => {
        if (err) {
          reject(err);
        }

        console.log(chalk.green(`${file} created successfully. Proceeding..`));

        resolve(validateImportTargetFile(file));
      });
    } else {
      resolve(validateImportTargetFile(file));
    }
  });
});
;


const componentImports = async () => {
  const less = `${process.env.THEME_DIRECTORY}/less`;

  try {
    await checkImportTargetFile(`${less}/components.less`);

    return gulp.src(`${less}/components.less`)
      .pipe(inject(
        gulp.src(`${less}/components/**/*.less`, { read: false }),
        {
          starttag: '/* Component imports start here */',
          endtag: '/* Component imports end here */',
          ignorePath: `/${process.env.THEME_DIRECTORY}/less/`,
          addRootSlash: false,
          transform: (filepath) => `@import "${filepath}";`
        }))
      .pipe(gulp.dest(less));
  }
  catch (err) {
    throw err;
  }
};
gulp.task(componentImports);

const unlinkPatterns = () => {
  return exec(`rm -rf ${process.env.THEME_DIRECTORY}/templates/components`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
gulp.task(unlinkPatterns);

const unlinkStyles = () => {
  return exec(`rm -rf ${process.env.THEME_DIRECTORY}/less/components`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
gulp.task(unlinkStyles);

const unlinkScripts = () => {
  return exec(`rm -rf ${process.env.THEME_DIRECTORY}/js/components`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
gulp.task(unlinkScripts);

const unlinkTheme = gulp.series(unlinkPatterns, unlinkStyles, unlinkScripts);

const symLinkPatterns = () => {
  return exec(`cd ${process.env.THEME_DIRECTORY}/templates && ln -fs ../../../../ui-component-library-proto/source/components`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
gulp.task(symLinkPatterns);

const symLinkStyles = () => {
  return exec(`cd ${process.env.THEME_DIRECTORY}/less && ln -fs ../../../../ui-component-library-proto/source/components`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
gulp.task(symLinkStyles);

const symLinkScripts = () => {
  return exec(`cd ${process.env.THEME_DIRECTORY}/js && ln -fs ../../../../ui-component-library-proto/source/components`, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
gulp.task(symLinkScripts);

const shouldRemoveComponents = async (callback) => {
  const shouldRemove = await helpers.checkForComponents();

  if (shouldRemove) {
    return unlinkTheme();
  }

  return callback();
};
gulp.task(shouldRemoveComponents);

const symLinkTheme = gulp.series(
  shouldRemoveComponents,
  symLinkPatterns,
  symLinkStyles,
  symLinkScripts,
  componentImports
);

const copyPatterns = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.phtml`)
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/templates/components`));
};
gulp.task(copyPatterns);

const copyStyles = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.less`)
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/less/components`));
};
gulp.task(copyStyles);

const copyScripts = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.js`)
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/js/components`));
};
gulp.task(copyScripts);

const shouldUnlinkTheme = async (callback) => {
  const shouldUnlink = await helpers.checkForSymlinks();

  if (shouldUnlink) {
    return unlinkTheme();
  }

  return callback();
};
gulp.task(shouldUnlinkTheme);

const copyTheme = gulp.series(
  shouldUnlinkTheme,
  copyPatterns,
  copyStyles,
  copyScripts,
  componentImports
);

const defaultTask = gulp.series(
  cleanPublic,
  gulp.parallel(patternLab, fonts, styles, scripts, vendorScripts)
);

const watch = gulp.series(defaultTask, watchTask);

// Descriptions
cleanPublic.description = "Clear all files under public directory";

patternLab.description = "Build PatternLab to public directory";

fonts.description = "Copy font files from theme directory";

styles.description = "Convert and minify Less to CSS";

scripts.description = "Build and uglify Javascript into main.js";

vendorScripts.description = "Build and uglify vendor Javascript";

watchTask.description = "Initialize BrowserSync instance and watch for changes";

componentImports.description = "Inject component imports to dedicated files";

shouldUnlinkTheme.description = "Ask if linked components should be unlinked";

symLinkPatterns.description = "Create patterns symbolic link";

symLinkStyles.description = "Create styles symbolic link";

symLinkScripts.description = "Create scripts symbolic link";

unlinkPatterns.description = "Remove symbolic link from working patterns";

unlinkStyles.description = "Remove symbolic link from working styles";

unlinkScripts.description = "Remove symbolic link from working scripts";

shouldRemoveComponents.description = "Ask if existing components in theme directory should be removed";

copyPatterns.description = "Create patterns copy";

copyStyles.description = "Create styles copy";

copyScripts.description = "Create Javascript scripts copy";

defaultTask.description = "Clear public directory and build patterns, CSS and Javascript from the source directory";

watch.description = 'Build PatternLab from source files and watch for changes.';

symLinkTheme.description = "Create symbolic links to working theme";

unlinkTheme.description = "Unlink/remove components from working theme";

copyTheme.description = "Copy components to working theme";

// Exports
exports.default = defaultTask;
exports.watch = watch;
exports.symLinkTheme = symLinkTheme;
exports.copyTheme = copyTheme;
exports.unlinkTheme = unlinkTheme;

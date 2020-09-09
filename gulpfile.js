require('dotenv').config();
const config = require('./patternlab-config.json');
const helpers = require('./gulp-helpers');

const gulp = require('gulp');
const less = require('gulp-less');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');

const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

const themesRootPath = path.resolve(process.env.THEMES_ROOT);
const themeDirectoryPath = path.resolve(process.env.THEME_DIRECTORY);
const componentsSourcePath = path.resolve(config.paths.source.patterns);

// Tasks
const cleanPublic = () => helpers.cleanDir(config.paths.public.root);
gulp.task(cleanPublic);

const patternLab = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell(['patternlab build --config ./patternlab-config.json']))
    .pipe(browserSync.stream());
};
gulp.task(patternLab);

const fonts = () => {
  const bootstrapFonts = `${themesRootPath}/bootstrap3/css/fonts`;
  const finnaFonts = `${themeDirectoryPath}/css/fonts`;

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
        '@themePath': themesRootPath
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

const importLess = async (files) => {
  try {
    const cleanPaths = files.map((file) => file.replace('./source/', ''));
    const importsString = `${cleanPaths.map((path) => {
      return `@import "${path}"`
    }).join(';\n')};`

    return fs.writeFile(`${themeDirectoryPath}/less/components.less`, importsString, (err) => {
      if (err) {
        throw err;
      }

      return;
    })
  } catch (error) {
    return error;
  }
};

const themeLessImports = async () => {
  try {
    const source = `${config.paths.source.root}/components/**/*.less`

    glob(source, async (err, files) => {
      if (err) {
        throw err;
      }

      await importLess(files);
    })
  } catch (error) {
    throw error;
  }
};
gulp.task(themeLessImports);

const unlinkPatterns = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`rm -rf ${themeDirectoryPath}/templates/components`]))
};
gulp.task(unlinkPatterns);

const unlinkStyles = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`rm -rf ${themeDirectoryPath}/less/components`]))
};
gulp.task(unlinkStyles);

const unlinkScripts = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`rm -rf ${themeDirectoryPath}/js/components`]))
};
gulp.task(unlinkScripts);

const unlinkTheme = gulp.series(unlinkPatterns, unlinkStyles, unlinkScripts);

const symLinkPatterns = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([
      `cd ${themeDirectoryPath}/templates && ln -fs ${componentsSourcePath}`
    ]));
};
gulp.task(symLinkPatterns);

const symLinkStyles = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`cd ${themeDirectoryPath}/less && ln -fs ${componentsSourcePath}`]));
};
gulp.task(symLinkStyles);

const symLinkScripts = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`cd ${themeDirectoryPath}/js && ln -fs ${componentsSourcePath}`]));
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
  themeLessImports
);

const copyPatterns = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.phtml`)
    .pipe(gulp.dest(`${themeDirectoryPath}/templates/components`));
};
gulp.task(copyPatterns);

const copyStyles = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.less`)
    .pipe(gulp.dest(`${themeDirectoryPath}/less/components`));
};
gulp.task(copyStyles);

const copyScripts = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.js`)
    .pipe(gulp.dest(`${themeDirectoryPath}/js/components`));
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
  themeLessImports
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

themeLessImports.description = "Inject component Less imports to dedicated files";

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

const gulp = require("gulp");
const { src, dest, parallel, watch, series } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const rtlcss = require("gulp-rtlcss");
const del = require("del");
const zip = require("gulp-zip");
const rename = require("gulp-rename");
const replace = require("gulp-string-replace");
const fileInclude = require("gulp-file-include");
const imageMin = require("gulp-imagemin");
const packageJson = require("./package.json");
const htmlBeauty = require("gulp-html-beautify");
const merge = require("merge-stream");
const htmlWatcher = ["./pages/**/*.*", "./blocks/**/*.*"];
const htmlDir = {
  src: "./pages/*",
  dest: "./"
};
const scssDir = {
  src: "./assets/sass/**/*.*",
  dest: "./assets/css"
};

const replaceProjectFiles = () => {
  return gulp
    .src("./**/packageName__.*")
    .pipe(
      rename((path) => {
        path.basename = path.basename.replace(
          "packageName__",
          packageJson.name
        );
      })
    )
    .pipe(gulp.dest("./"));
};
const replaceProjectName = () => {
  let blocks = gulp
    .src("./blocks/**/*.*")
    .pipe(replace("packageName__", packageJson.name))
    .pipe(gulp.dest("./blocks"));
  let js = gulp
    .src("./assets/js/**/*.*")
    .pipe(replace("packageName__", packageJson.name))
    .pipe(gulp.dest("./assets/js"));
  let sass = gulp
    .src("./assets/sass/**/*.*")
    .pipe(replace("thm", packageJson.name))
    .pipe(gulp.dest("./assets/sass"));
  return merge(blocks, js, sass);
};

const cleanUp = () => {
  return del("**/packageName__.*");
};

const makeFileInclude = () => {
  const options = {
    prefix: "@@",
    basepath: "@root"
  };
  return src(htmlDir.src).pipe(fileInclude(options)).pipe(dest(htmlDir.dest));
};

const makeCss = () => {
  const options = {
    outputStyle: "expanded",
    indentType: "space",
    indentWidth: 2,
    sourceMap: "sass"
  };
  // sass.compiler = require("node-sass");
  return src(scssDir.src)
    .pipe(sourcemaps.init())
    .pipe(sass(options).on("error", sass.logError))
    .pipe(sourcemaps.write("./"))
    .pipe(dest(scssDir.dest))
    .pipe(browserSync.stream());
};

const makeRTL = () => {
  return src([scssDir.dest + "/" + packageJson.name + ".css"])
    .pipe(rtlcss())
    .pipe(rename({ suffix: "-rtl" }))
    .pipe(dest(scssDir.dest));
};

const makeServer = () => {
  browserSync.init({
    server: "./"
  });

  gulp.watch("./assets/sass/**/*.scss", series([makeCss, makeRTL]));
  gulp.watch(htmlWatcher, parallel([makeFileInclude]));
  gulp
    .watch(["./*.html", "./assets/js/**/*.*"])
    .on("change", browserSync.reload);
};

exports.default = series([
  replaceProjectFiles,
  cleanUp,
  replaceProjectName,
  makeFileInclude,
  makeCss,
  makeRTL,
  makeServer
]);

const makeBeautifulHtml = () => {
  const options = [
    {
      indent_size: 4,
      indent_with_tabs: false
    }
  ];
  return src(["./*.html"]).pipe(htmlBeauty(options)).pipe(dest("./"));
};

exports.compressImage = () => {
  const options = [
    imageMin.gifsicle({ interlaced: true }),
    imageMin.mozjpeg({ quality: 75, progressive: true }),
    imageMin.optipng({ optimizationLevel: 5 }),
    imageMin.svgo({
      plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
    })
  ];
  return src(["./assets/images/**/*.*"])
    .pipe(imageMin(options))
    .pipe(dest("./assets/images/"))
    .pipe(browserSync.stream());
};

const makeZip = () => {
  return src([
    "./**/*.*",
    "!./.vscode",
    "!./{pages,pages/**}",
    "!./{blocks,blocks/**}",
    "!./{.DS_Store,.DS_Store/**}",
    "!./{node_modules,node_modules/**}",
    "!./{vendor,vendor/**}",
    "!./{.git,.git/**}",
    "!./.stylelintrc.json",
    "!./.eslintrc",
    "!./.gitattributes",
    "!./.github",
    "!./.gitignore",
    "!./README.md",
    "!./composer.json",
    "!./composer.lock",
    "!./commitlint.config.js",
    "!./package-lock.json",
    "!./package.json",
    "!./.travis.yml",
    "!./yarn.lock",
    "!./style.css.map",
    "!./assets/css/*.map",
    "!./assets/sass/**",
    "!./gulpfile.js",
    "!./vercel.json"
  ])
    .pipe(zip(packageJson.name + "-html-main.zip"))
    .pipe(dest("../"));
};

exports.makeBundle = series([
  replaceProjectFiles,
  cleanUp,
  replaceProjectName,
  makeFileInclude,
  makeCss,
  makeRTL,
  makeBeautifulHtml,
  makeZip
]);

exports.build = series([
  replaceProjectFiles,
  cleanUp,
  replaceProjectName,
  makeFileInclude,
  makeCss,
  makeRTL,
  makeBeautifulHtml
]);

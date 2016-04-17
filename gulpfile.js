//include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var runSequence = require('run-sequence');
var del = require('del');

var bases = {
  src: 'static/',
  build: 'static/'
};

var paths = {
  scripts:'static/javascript/**/*.js',
  libs: 'static/libs/**/*.js',
  images: 'static/images/**/*',
  html: 'static/templates/*.html',
  less: 'static/styles/**/*.less'
};

// JS hint task
gulp.task('jshint', function(){
  gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});
// minify new images
gulp.task('imagemin', function(){
  return gulp.src(paths.images, {base:bases.src})
      .pipe(changed(bases.build))
      .pipe(imagemin())
      .pipe(gulp.dest(bases.build));
});
// minify new or changed HTML pages
gulp.task('htmlpage', function(){
  return gulp.src(paths.html, {base:bases.src})
      .pipe(changed(bases.build))
      .pipe(minifyHTML())
      .pipe(gulp.dest(bases.build));
});
// JS concat, strip debugging and minify
gulp.task('scripts', function(){
  return gulp.src(paths.scripts, {base:bases.src})
      .pipe(concat('scripts.min.js'))
      .pipe(stripDebug())
      .pipe(uglify())
      .pipe(gulp.dest(bases.build));
});
// Compiles LESS into auto-prefixed and minified CSS
gulp.task('cless', function(){
    return gulp.src(paths.less, {base:bases.src})
        .pipe(less())
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(bases.build));
});
// Cleans the build directory
gulp.task('clean', function(){
  return del(bases.build);
});
// Copies relevant files into build
gulp.task('init', function(){
  return gulp.src([paths.scripts, paths.libs], {base:bases.src})
      .pipe(gulp.dest(bases.build));
});
// Builds the project
gulp.task('build', ['clean'], function(){
  runSequence('init', ['htmlpage', 'cless', 'imagemin']);
});
// Default gulp
gulp.task('default', ['cless'], function() {
  // watch for IMAGE changes
  //gulp.watch(paths.images, ['imagemin']);
  // watch for HTML changes
  //gulp.watch(paths.html, ['htmlpage']);
  // watch for LESS changes
  gulp.watch(paths.less, ['cless']);
  // watch for JS changes
  // gulp.watch('./static/scripts/**/*.js', ['jshint', 'scripts']);
});

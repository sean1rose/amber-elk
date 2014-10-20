'use strict';
var gulp = require('gulp');
var bs = require('browser-sync');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var jsdoc = require('gulp-jsdoc');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var rename  = require('gulp-rename');
var rimraf = require('gulp-rimraf');
// the paths to our app files
var paths = {
  scripts: ['client/app/**/*.js'],
  distscripts: ['dist/js/**/*.js'],
  html: ['client/pages/*.html', 'client/index.html'],
  disthtml: ['dist/pages/*.html', 'dist/index.html'],
  styles: ['client/styles/**/*.css'],
  diststyles: ['dist/css/**/*.css'],
  tests: ['tests/**/*.js'],
  serverScripts: ['server/**/*.js']
};

// JS HINT on both client js and server js
gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Start browser sync with the server
gulp.task('start', ['serve'],function () {
  bs({
    notify: true,
    injectChanges: true,
    files: paths.scripts.concat(paths.disthtml, paths.diststyles),
    proxy: 'localhost:1337'
  });
});

// Start the server
gulp.task('serve', function() {
  nodemon({script: 'server/index.js', ignore: 'node_modules/**/*.js'});
});

// Mocha testing
gulp.task('test', function() {
  return gulp.src(paths.tests, {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

// Minify Javascript
gulp.task('minjs', function() {
  gulp.src(paths.scripts)
    .pipe(concat('main.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});
// Minify CSS
gulp.task('mincss', function() {
  gulp.src(paths.styles)
    .pipe(concat('main.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'));
});
// Get external libraries
gulp.task('bowerbuildjs', function() {
  gulp.src([
      'client/bower_components/jquery/dist/jquery.min.js',
      'client/bower_components/firebase/firebase.js',
      'client/bower_components/three.js/three.min.js',
      'client/bower_components/semantic/build/packaged/javascript/semantic.min.js'
    ])
    .pipe(uglify({ mangle: false, compress: false }))
    .pipe(concat('vendor.js'))
    .pipe(rename({suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('bowerbuildcss', function() {
  gulp.src([
      'client/bower_components/semantic/build/packaged/css/semantic.min.css'
    ])
    .pipe(concat('vendor.css'))
    .pipe(rename({suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});
// Grab other static files
gulp.task('copystatic', function() {
  gulp.src(['client/index.html'])
    .pipe(gulp.dest('dist'));
  gulp.src(['client/pages/**/*.html'])
    .pipe(gulp.dest('dist/pages'));
  gulp.src(['client/public/**'])
    .pipe(gulp.dest('dist/public'));
  gulp.src(['client/bower_components/semantic/build/packaged/fonts/**.*'])
    .pipe(gulp.dest('dist/fonts'));
});
// Remove the dist folder to properly regenerate it
gulp.task('cleanup', function() {
  return gulp.src(['dist/**/*.*'], {read: false})
    .pipe(rimraf());
});

gulp.task('reloadpage', function(){
  bs.reload();
});
// Build for production
gulp.task('build', ['cleanup', 'copystatic', 'bowerbuildjs', 'bowerbuildcss', 'minjs', 'mincss']);

// Get ready for deployment
gulp.task('deploy', ['lint', 'build', 'test']);

// Generate docs using jsdoc
gulp.task('docs', function() {
  return gulp.src(paths.scripts.concat(['README.md']))
    .pipe(jsdoc('./docs'));
});
// By default, run linter, test the code, and start the server
gulp.task('default', ['lint', 'build', 'test', 'start'], function(){
  gulp.watch(paths.html, ['copystatic', 'reloadpage']);
  gulp.watch(paths.scripts, ['minjs', 'reloadpage']);
  gulp.watch(paths.styles, ['mincss', 'reloadpage']);
});

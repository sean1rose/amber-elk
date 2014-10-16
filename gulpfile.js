'use strict';
var gulp = require('gulp');
var bs = require('browser-sync');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var jsdoc = require('gulp-jsdoc');
// the paths to our app files
var paths = {
  scripts: ['client/app/**/*.js'],
  html: ['client/pages/*.html', 'client/index.html'],
  styles: ['client/styles/**/*.css'],
  tests: ['tests/**/*.js'],
  serverScripts: ['server/**/*.js']
};

// JS HINT on both client js and server js
gulp.task('lint', function() {
  return gulp.src(paths.scripts.concat(paths.serverScripts))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Start browser sync with the server
gulp.task('start', ['serve'],function () {
  bs({
    notify: true,
    injectChanges: true,
    files: paths.scripts.concat(paths.html, paths.styles),
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

// TODO add minifying tasks for JS and CSS
gulp.task('build', function() {

});

// Generate docs using jsdoc
gulp.task('docs', function() {
  return gulp.src(paths.scripts.concat(['README.md']))
    .pipe(jsdoc('./docs'));
});

gulp.task('default', ['lint', 'test', 'start']);

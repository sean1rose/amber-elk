'use strict';
var gulp = require('gulp');
var bs = require('browser-sync');
var nodemon = require('gulp-nodemon');

// the paths to our app files
var paths = {
  scripts: ['client/app/**/*.js'],
  html: ['client/pages/*.html', 'client/index.html'],
  styles: ['client/styles/**/*.css'],
  test: ['tests/**/*.js']
};

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

// TODO add testing task

// TODO add minifying tasks for JS and CSS

gulp.task('default', ['start']);

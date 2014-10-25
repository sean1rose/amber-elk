// Karma configuration
// Generated on Tue Oct 21 2014 15:13:10 GMT-0700 (PDT)

'use strict';

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'client/bower_components/jquery/dist/jquery.min.js',
      'client/bower_components/firebase/firebase.js',
      'client/bower_components/three.js/three.min.js',
      'client/bower_components/semantic/build/packaged/javascript/semantic.min.js',
      'app/js/models/RingGeometry3D.js',
      'app/js/models/RingArray.js',
      'app/js/models/player.js',
      'app/js/game.js',
      'tests/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/**/[^OrbitControls]*.js' : ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // Configure the reporter
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // global config for SauceLabs
    sauceLabs: {
      startConnect: true,
      testName: 'Amber Elk unit tests'
    },

    // define SL browsers
    customLaunchers: {
      sl_chrome_OSX9: {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '31',
        platform: 'OS X 10.9'
      }
    },
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: process.env.TRAVIS ? [ 'sl_chrome_OSX9' ] : [ 'Chrome' ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

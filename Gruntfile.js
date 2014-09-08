// 包装函数
module.exports = function(grunt) {

  // 任务配置
  grunt.initConfig({
    karma: {
        options: {
            configFile: 'karma.conf.js'
        },

        continuous: {
            // preprocess matching files before serving them to the browser
            // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
            preprocessors: {
                // source files, that you wanna generate coverage for
                // do not include tests or libraries
                // (these files will be instrumented by Istanbul)
                'src/storage.js': ['coverage']
            },


            // test results reporter to use
            // possible values: 'dots', 'progress'
            // available reporters: https://npmjs.org/browse/keyword/karma-reporter
            // plugin support: junit, should config junitReporter in use
            // plugin support: coverage, should config coverageReporter and preprocessors in use
            reporters: ['progress','coverage','junit'],


            // optionally, configure the reporter
            junitReporter: {
                outputFile: 'test-results.xml'
            },


            // optionally, configure the reporter
            coverageReporter: {
                type : 'lcov',
                dir : 'coverage/',
                subdir: './'
            },


            // start these browsers
            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            // available options 'Chrome', 'IE', 'Firefox', 'PhantomJS'while 'IE8','IE9' appoaching
            browsers: ['PhantomJS'],


            // Continuous Integration mode
            // if true, Karma captures browsers, runs the tests and exits
            singleRun: true
        }
    }
  });

  // 任务加载
  grunt.loadNpmTasks('grunt-karma');

};
module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/*.js',
      'tests/unit/*.js'
    ],

    autoWatch : true,
    singleRun : true,

    frameworks: ['jasmine',
                 'jasmine-matchers'],

    browsers : ['Firefox'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};

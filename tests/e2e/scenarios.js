'use strict';

describe('deeVee app', function() {

  describe('Staging view', function() {

    beforeEach(function() {
      browser.get('index.html');
    });


    it('should add a stage when the user clicks "add stage"', function() {

      var stageList = element.all(by.repeater('stage in stageList'));

      expect(stageList.count()).toBe(0);

    });


  });
});

'use strict';

describe('deeVee app', function() {

  describe('Staging view', function() {

    beforeEach(function() {
      browser.get('index.html');
    });


    it('should allow the user to add and remove stages', function() {

      var stageList = element.all(by.repeater('stage in stageList'));
      var stageAdd = element(by.css('.stageAdd'));
      var stageRemove = element(by.css('.stageRemove'));

      expect(stageList.count()).toBe(0);
      stageAdd.click();
      expect(stageList.count()).toBe(1);
      stageRemove.click();
      expect(stageList.count()).toBe(0);

    });

    it('should allow the user to select parts to add and remove', function() {
      var stageAdd = element(by.css('.stageAdd'));
      var partAdd = element(by.css('.partAdd'));
      var dialog = element(by.css('.dialog'));

      stageAdd.click();
      expect(dialog.isPresent()).toBeFalsy;
      partAdd.click();
      expect(dialog.isPresent()).toBeTruthy;

    });
  });
});

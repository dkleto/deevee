'use strict';

describe('deeVee app', function() {

  beforeEach(function() {
    browser.get('index.html');
  });
  describe('Staging view', function() {



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
  });
  describe('Parts dialog view', function() {

    it('should allow the user to select parts to add and remove', function() {
      var stageAdd = element(by.css('.stageAdd'));
      var partAdd = element(by.css('.partAdd'));
      var dialog = element(by.css('.dialog'));
      var partsList = element.all(by.repeater('part in stage.partsList'));

      stageAdd.click();
      expect(dialog.isPresent()).toBeFalsy;
      expect(partsList.count()).toBe(0);
      partAdd.click();
      expect(dialog.isPresent()).toBeTruthy;

    });
  });
});

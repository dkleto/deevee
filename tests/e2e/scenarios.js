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
  describe('Part selection', function() {

    it('should allow the user to add a part', function() {
      var stageAdd = element(by.css('.stageAdd'));
      var partAdd = element(by.css('.partAdd a'));
      var dialog = element(by.css('.dialog'));
      var partsList = element.all(by.repeater('part in stage.partsList'));
      var catTitle = element.all(by.repeater('category in parts')).first();
      var part = element.all(by.repeater('part in subcategory.parts')).first();

      stageAdd.click();
      expect(dialog.isPresent()).toBeFalsy;
      expect(partsList.count()).toBe(0);
      partAdd.click();
      expect(dialog.isPresent()).toBeTruthy;
      catTitle.click();
      part.click();
      expect(partsList.count()).toBe(1);
    });

    it('should allow the user to add multiple parts', function() {
      var stageAdd = element(by.css('.stageAdd'));
      var partAdd = element(by.css('.partAdd a'));
      var dialog = element(by.css('.dialog'));
      var partsList = element.all(by.repeater('part in stage.partsList'));
      var catTitle = element.all(by.repeater('category in parts')).first();
      var part = element.all(by.repeater('part in subcategory.parts')).first();
      var multiplier = element(by.css('.multiplier a'));

      stageAdd.click();
      expect(dialog.isPresent()).toBeFalsy;
      expect(partsList.count()).toBe(0);
      partAdd.click();
      expect(dialog.isPresent()).toBeTruthy;
      catTitle.click();
      multiplier.click();
      part.click();
      expect(partsList.count()).toBe(2);
    });

    it('should allow the user to close the parts dialog', function() {
      var stageAdd = element(by.css('.stageAdd'));
      var partAdd = element(by.css('.partAdd a'));
      var dialog = element(by.css('.dialog'));
      var closeDialog = element(by.css('.dialogClose'));
      var overlay = element(by.css('.overlay'));

      /* First test cancel icon in top right corner. */
      stageAdd.click();
      expect(dialog.isPresent()).toBeFalsy;
      partAdd.click();
      expect(dialog.isPresent()).toBeTruthy;
      closeDialog.click();
      expect(dialog.isPresent()).toBeFalsy;

      /* Test cancellation by clicking outside the dialog. */
      partAdd.click();
      expect(dialog.isPresent()).toBeTruthy;
      overlay.click();
      expect(dialog.isPresent()).toBeFalsy;

    });

    it('should allow the user to remove parts', function() {
      var stageAdd = element(by.css('.stageAdd'));
      var partAdd = element(by.css('.partAdd a'));
      var dialog = element(by.css('.dialog'));
      var partsList = element.all(by.repeater('part in stage.partsList'));
      var catTitle = element.all(by.repeater('category in parts')).first();
      var part = element.all(by.repeater('part in subcategory.parts')).first();
      var multiplier = element(by.css('.multiplier a'));
      var partRemove = element(by.css('.partRemove a'));

      stageAdd.click();
      expect(dialog.isPresent()).toBeFalsy;
      expect(partsList.count()).toBe(0);
      partAdd.click();
      expect(dialog.isPresent()).toBeTruthy;
      catTitle.click();
      part.click();
      expect(partsList.count()).toBe(1);
      partRemove.click();
      expect(partsList.count()).toBe(0);
    });

    it('should not reset scroll position', function() {
      var stageAdd = element(by.css('.stageAdd'));
      var partAdd = element.all(by.css('.partAdd a')).last();
      var catTitle = element.all(by.repeater('category in parts')).first();
      var part = element.all(by.repeater('part in subcategory.parts')).first();
      var closeDialog = element(by.css('.dialogClose'));
      var overlay = element(by.css('.overlay'));
      var getScroll = 'return window.pageYOffset;';
      var scrollBottom = 'window.scrollTo(0,document.body.scrollHeight);';

      /* Test stage addition. */
      expect(browser.executeScript(scrollBottom + getScroll)).toEqual(0);

      for (var i=0; i<16; i++) {
          stageAdd.click();
      }
      expect(browser.executeScript(getScroll)).toNotEqual(0);

      /* Test part addition. */
      browser.executeScript(scrollBottom).then(function() {
          partAdd.click();
          catTitle.click();
          part.click();
          expect(browser.executeScript(getScroll)).toNotEqual(0);
     });

      /* Test parts dialog cancellation by clicking cancel icon. */
      browser.executeScript(scrollBottom).then(function() {
          partAdd.click();
          closeDialog.click();
          expect(browser.executeScript(getScroll)).toNotEqual(0);
      });

      /* Test parts dialog cancellation by clicking outside dialog. */
      browser.executeScript(scrollBottom).then(function() {
          partAdd.click();
          overlay.click();
          expect(browser.executeScript(getScroll)).toNotEqual(0);
      });

    });

  });
});

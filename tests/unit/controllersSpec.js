'use strict';

/* jasmine specs for controllers go here */
describe('deeVee controllers', function() {

  describe('stageCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(module('deeVee'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('parts/parts.json').
          respond([
            {name: 'Select part'},
            {name: 'LVT-30',
             wetmass: 1.25,
             drymass: 1.25,
             impulse: 280,
             thrust: 200.67},
            {name : 'FTL-T400',
             wetmass : 2.25,
             drymass : 0.25 }
          ]);
      scope = $rootScope.$new();
      ctrl = $controller('stageCtrl', {$scope: scope});
    }));


    it('should create "parts" model with parts fetched from xhr', function() {
      expect(scope.parts).toBeUndefined();
      $httpBackend.flush();

      expect(scope.parts).toEqual([
            {name: 'Select part'},
            {name: 'LVT-30',
             wetmass: 1.25,
             drymass: 1.25,
             impulse: 280,
             thrust: 200.67},
            {name : 'FTL-T400',
             wetmass : 2.25,
             drymass : 0.25 }
          ]);
    });


    it('should set the default selected option', function() {
      expect(scope.selected).toBeUndefined();
      $httpBackend.flush();
      expect(scope.selected).toEqual({name: 'Select part'});
    });

    it('should add a new part', function() {
        var testPart =
            {'name' : 'test part',
             'wetmass' : 0.5,
             'drymass' : 0.25};

        $httpBackend.flush();
        scope.addPart(testPart);
        expect(scope.partsList.length === 1);
    });

    it('should remove a part', function() {
        var testPart =
            {'name' : 'test part',
             'wetmass' : 0.5,
             'drymass' : 0.25};
        $httpBackend.flush();
        scope.partsList = [testPart];
        expect(scope.partsList.length === 1);
        scope.removePart(0);
        expect(scope.partsList.length === 0);
    });
  });
});

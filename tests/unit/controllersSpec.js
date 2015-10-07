'use strict';

/* jasmine specs for controllers go here */
describe('deeVee controllers', function() {

  describe('stageCtrl', function(){
    var scope, ctrl, $httpBackend, testpart1, testpart2;

    beforeEach(module('deeVee'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      scope = $rootScope.$new();
      scope.testPart1 = {name: 'LVT-30',
                   wetmass: 1.25,
                   drymass: 1.25,
                   impulse: 280,
                   thrust: 200.67};
      scope.testPart2 = {name : 'FTL-T400',
                   wetmass : 2.25,
                   drymass : 0.25 };
      scope.result1 = {'impulse' : 280,
                       'thrustratio' : 5.844473569244211,
                       'dv' : 2327.357762911571};
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('parts/parts.json').
          respond([
            {name: 'Select part'},
            scope.testPart1,
            scope.testPart2
          ]);
      ctrl = $controller('stageCtrl', {$scope: scope});
    }));


    it('should create "parts" model with parts fetched from xhr', function() {
      expect(scope.parts).toBeUndefined();
      $httpBackend.flush();

      expect(scope.parts).toEqual([
            {name: 'Select part'},
            scope.testPart1,
            scope.testPart2
          ]);
    });


    it('should set the default selected option', function() {
      expect(scope.selected).toBeUndefined();
      $httpBackend.flush();
      expect(scope.selected).toEqual({name: 'Select part'});
    });

    it('should add a new part', function() {
        $httpBackend.flush();
        expect(scope.partsList.length).toEqual(0);
        scope.addPart(scope.testPart1);
        expect(scope.partsList.length).toEqual(1);
    });

    it('should handle parts without impulse or thrust', function() {
        $httpBackend.flush();
        scope.addPart(scope.testPart2);
        expect(scope.partsList[0].impulse).toEqual(0);
        expect(scope.partsList[0].thrust).toEqual(0);
    });

    it('should remove a part', function() {
        $httpBackend.flush();
        scope.partsList = [scope.testPart1];
        expect(scope.partsList.length).toEqual(1);
        scope.removePart(0);
        expect(scope.partsList.length).toEqual(0);
    });

    });
  });
});

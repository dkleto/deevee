'use strict';

describe('deeVee controllers', function() {

  describe('stageCtrl', function(){
    var scope, ctrl, $httpBackend, testpart1, testpart2;

    beforeEach(module('deeVee'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      scope = $rootScope.$new();
      scope.testPart1 = {name: 'LVT-30',
                   wetmass: 1.25,
                   drymass: 1.25,
                   impulseatm : 280,
                   impulsevac : 300,
                   thrustatm  : 200.67,
                   thrustvac  : 215};
      scope.testPart2 = {name : 'FTL-T400',
                   wetmass : 2.25,
                   drymass : 0.25 };
      scope.calculationResult1 = {'impulse' : 280,
                                  'thrustratio' : 5.844473569244211,
                                  'dv' : 2327.357762911571,
                                  'sumwetmass' : 3.5};
      scope.calculationResult2 = {'impulse' : 280,
                                   'thrustratio' : 2.9222367846221053,
                                   'dv' : 924.2219395511477,
                                   'sumwetmass' : 7};
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
      $httpBackend.flush();
      expect(scope.newStage().selected).toEqual({name: 'Select part'});
    });

    it('should add a new part', function() {
        $httpBackend.flush();
        var testStage = scope.newStage();
        expect(testStage.partsList.length).toEqual(0);
        testStage.addPart(scope.testPart1);
        expect(testStage.partsList.length).toEqual(1);
    });

    it('should handle parts without impulse or thrust', function() {
        $httpBackend.flush();
        var testStage = scope.newStage();
        testStage.addPart(scope.testPart2);
        expect(testStage.partsList[0].impulseatm).toEqual(0);
        expect(testStage.partsList[0].thrustatm).toEqual(0);
        expect(testStage.partsList[0].impulsevac).toEqual(0);
        expect(testStage.partsList[0].thrustvac).toEqual(0);
    });

    it('should remove a part', function() {
        $httpBackend.flush();
        var testStage = scope.newStage();
        testStage.partsList = [scope.testPart1];
        expect(testStage.partsList.length).toEqual(1);
        testStage.removePart(0);
        expect(testStage.partsList.length).toEqual(0);
    });

    it('should calculate impulse, thrust ratio and dV', function() {
        $httpBackend.flush();
        var testStage = scope.newStage();
        testStage.addPart(scope.testPart1);
        testStage.addPart(scope.testPart2);
        expect(testStage.calculate(0)).toEqual(scope.calculationResult1);
    });

    it('should use impulse/thrust values specific to atmosphere', function() {
        $httpBackend.flush();
        var result, testStage;
        testStage = scope.newStage();
        testStage.addPart(scope.testPart1);
        testStage.addPart(scope.testPart2);
        result = testStage.calculate(0);
        expect(result.impulse).toEqual(280);
        expect(result.thrustratio).toEqual(5.844473569244211);
        testStage.atm = false;
        result = testStage.calculate(0);
        expect(result.impulse).toEqual(300);
        expect(result.thrustratio).toEqual(6.2618319499053445);
    });

    it('should add a new stage', function() {
        $httpBackend.flush();
        expect(scope.stageList.length).toEqual(0);
        scope.addStage();
        expect(scope.stageList.length).toEqual(1);
    });

    it('should remove a specific stage', function() {
        $httpBackend.flush();
        scope.addStage();
        scope.addStage();
        scope.stageList[0].addPart(scope.testPart2);
        scope.stageList[1].addPart(scope.testPart1);
        expect(scope.stageList.length).toEqual(2);
        scope.removeStage(0);
        expect(scope.stageList.length).toEqual(1);
        expect(scope.stageList[0].partsList).toEqual([scope.testPart1]);
    });

    it('should add a new part to a specific stage', function() {
        $httpBackend.flush();
        scope.addStage();
        scope.addStage();
        expect(scope.stageList[1].partsList).toEqual([]);
        scope.addStagePart(1, scope.testPart1);
        expect(scope.stageList[1].partsList).toEqual([scope.testPart1]);
    });

    it('should remove a part from a specific stage', function() {
        $httpBackend.flush();
        scope.addStage();
        scope.addStage();
        scope.addStagePart(1, scope.testPart1);
        expect(scope.stageList[1].partsList).toEqual([scope.testPart1]);
        scope.removeStagePart(1, 0);
        expect(scope.stageList[1].partsList).toEqual([]);
    });

    it('should update calculations across lower stages', function() {
        $httpBackend.flush();
        scope.addStage();
        scope.addStage();
        scope.stageList[0].addPart(scope.testPart1);
        scope.stageList[0].addPart(scope.testPart2);
        scope.stageList[1].addPart(scope.testPart1);
        scope.stageList[1].addPart(scope.testPart2);
        scope.updateCalculations(0);
        expect(scope.stageList[0].result).toEqual(scope.calculationResult1);
        expect(scope.stageList[1].result).toEqual(scope.calculationResult2);
    });
  });
});

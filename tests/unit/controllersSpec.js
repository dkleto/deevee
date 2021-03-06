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
            {"name" : 'Test parts',
             "subcategories":
                [
                    {"name" : "Engines",
                     "parts" : [scope.testPart1]
                    },
                    {"name" : "Fuel tanks",
                     "parts" : [scope.testPart2]
                    }
                ]
            }
          ]);
      ctrl = $controller('stageCtrl', {$scope: scope});
    }));

    it('should have an array of part category objects', function() {
      expect(scope.parts).toBeUndefined();
      $httpBackend.flush();
      expect(scope.parts).toBeArrayOfObjects();
    });

    it('should have categories with an array of subcategory objects', function() {
      expect(scope.parts).toBeUndefined();
      $httpBackend.flush();
      expect(scope.parts[0].subcategories).toBeArrayOfObjects();
    });

    it('should have subcategories with part objects', function() {
      expect(scope.parts).toBeUndefined();
      $httpBackend.flush();
      expect(scope.parts[0].subcategories[0].parts).toBeArrayOfObjects();
      expect(scope.parts[0].subcategories[1].parts).toBeArrayOfObjects();
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
        scope.addStagePart(1, scope.testPart1, 1);
        expect(scope.stageList[1].partsList).toEqual([scope.testPart1]);
    });

    it('should remove a part from a specific stage', function() {
        $httpBackend.flush();
        scope.addStage();
        scope.addStage();
        scope.addStagePart(1, scope.testPart1, 1);
        expect(scope.stageList[1].partsList).toEqual([scope.testPart1]);
        scope.removeStagePart(1, 0);
        expect(scope.stageList[1].partsList).toEqual([]);
    });

    it('should add multiple parts to a specific stage', function() {
        $httpBackend.flush();
        scope.addStage();
        scope.addStage();
        expect(scope.stageList[1].partsList).toEqual([]);
        scope.addStagePart(1, scope.testPart1, 2);
        expect(scope.stageList[1].partsList.length).toEqual(2);
        scope.removeStagePart(1, 0);
        expect(scope.stageList[1].partsList).toEqual([scope.testPart1]);
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

    it('should update total values', function() {
        $httpBackend.flush();
        scope.addStage();
        scope.addStage();
        scope.stageList[0].addPart(scope.testPart1);
        scope.stageList[0].addPart(scope.testPart2);
        scope.stageList[1].addPart(scope.testPart1);
        scope.stageList[1].addPart(scope.testPart2);
        scope.updateCalculations(0);
        scope.updateCalculations(1);
        expect(scope.totals).toEqual({'totaldv'   : 0,
                                      'totalmass' : 0,
                                      'totalparts': 0});
        scope.updateTotals();
        expect(scope.totals).toEqual({'totaldv'   : 3251.579702462719,
                                      'totalmass' : 7,
                                      'totalparts': 4});
    });

    it('should never have NaN as total values', function() {
        $httpBackend.flush();
        var checkTotals = function(totals) {
            for (var property in totals) {
                if (totals.hasOwnProperty(property)) {
                    expect(!isNaN(property)).toBeFalse();
                }
            }
        }
        checkTotals(scope.totals);
        scope.addStage();
        scope.addStage();
        scope.addStage();
        checkTotals(scope.totals);
        scope.stageList[0].addPart(scope.testPart1);
        scope.stageList[0].addPart(scope.testPart2);
        scope.stageList[1].addPart(scope.testPart1);
        scope.stageList[1].addPart(scope.testPart2);
        checkTotals(scope.totals);
        scope.updateCalculations(0);
        checkTotals(scope.totals);
        scope.updateCalculations(1);
        checkTotals(scope.totals);
    });


    it('should highglight multiplier with the right colour', function() {
        expect(scope.multiplier).toEqual(1);
        expect(scope.multiClass()).toEqual('');
        for (var i=2; i<6; i++) {
            scope.incrementMultiplier();
            expect(scope.multiplier).toEqual(i);
            expect(scope.multiClass()).toEqual('highlight-blue');
        }
        scope.incrementMultiplier();
        expect(scope.multiplier).toEqual(1);
        expect(scope.multiClass()).toEqual('');
    });

    it('should reset multiplier for each new part selection', function() {
        expect(scope.multiplier).toEqual(1);
        scope.multiplier = 2;
        scope.openPartDialog();
        expect(scope.multiplier).toEqual(1);
    });
  });
});

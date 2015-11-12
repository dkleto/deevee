'use strict';

var deevee = angular.module('deeVee', ['ngRoute']);

deevee.controller('stageCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('parts/parts.json').success(function(data) {
      $scope.parts = data;
      $scope.hideCats();
    });
    $scope.isPartDialogOpen = function() {
        return $scope.partDialog ? 'partDialogOpen' : '';
    }
    $scope.catSelected = function(index) {
        return $scope.parts[index].visible ? 'selected' : '';
    }
    $scope.hideCats = function() {
      for (var i = 0; i < $scope.parts.length; i++) {
          $scope.parts[i].visible = false;
      }
    }
    $scope.toggleCat = function(catIndex) {
        $scope.hideCats();
        $scope.parts[catIndex].visible = !$scope.parts[catIndex].visible;
    }
    $scope.partDialog = false;
    $scope.currentStage = false;
    $scope.openPartDialog = function(stageIndex) {
        $scope.currentStage = stageIndex;
        $scope.partDialog = true;
    }
    $scope.closePartDialog = function() {
        $scope.partDialog = false;
        $scope.currentStage = false;
    }
    $scope.savePartDialog = function(stageIndex, part) {
        $scope.addStagePart(stageIndex, part);
        $scope.closePartDialog();
    }
    $scope.gravity = 9.81;
    $scope.totals = {'totaldv'   : 0,
                     'totalmass' : 0,
                     'totalparts': 0};
    $scope.checkProperty = function(part, property) {
        // If a part doesn't have an impulse or thrust value, assume zero.
        if (typeof part[property] === 'number') {
            return part[property];
        } else {
            return 0;
        }
    }
    $scope.stageList = [];
    $scope.addStage = function() {
        $scope.stageList.push($scope.newStage());
        $scope.updateTotals();
    }
    $scope.removeStage = function(stageIndex) {
        $scope.stageList.splice(stageIndex, 1);
        if ($scope.stageList.length > 0) {
            $scope.updateCalculations(stageIndex);
        }
        $scope.updateTotals();
    }
    $scope.addStagePart = function(stageIndex, part) {
        $scope.stageList[stageIndex].addPart(part);
        $scope.updateCalculations(stageIndex);
        $scope.updateTotals();
    }
    $scope.removeStagePart = function(stageIndex, partid) {
        $scope.stageList[stageIndex].removePart(partid);
        $scope.updateCalculations(stageIndex);
        $scope.updateTotals();
    }
    $scope.updateCalculations = function(stageIndex) {
        // The uppermost stage has no payload to factor in.
        if (stageIndex === 0) {
            $scope.stageList[stageIndex].result = $scope.stageList[stageIndex].calculate(0);
            if ($scope.stageList.length > 0) {
                $scope.updateCalculations(1);
            }
        } else {
            // Recalculate all stages below this one as well.
            for (var i = stageIndex; i < $scope.stageList.length; i++) {
                $scope.stageList[i].result = $scope.stageList[i].calculate($scope.stageList[i - 1].result['sumwetmass']);
            }
        }
    }
    $scope.updateTotals = function() {
        var totalMass, totaldv, totalParts;
        totalMass = totaldv = totalParts = 0;
        for (var i = 0; i < $scope.stageList.length; i++) {
            totaldv += $scope.stageList[i].result.dv;
            totalParts += $scope.stageList[i].partsList.length;
            // Just use the value of the last stage, as sumwetmass is cumulative.
            if (i === $scope.stageList.length - 1) {
                totalMass = $scope.stageList[i].result.sumwetmass;
            }
        }

        $scope.totals = {'totaldv'   : totaldv,
                         'totalmass' : totalMass,
                         'totalparts': totalParts};
    }
    $scope.newStage = function() {
        var stage = {};
        stage.atm = true;
        stage.partsList = [];
        stage.result = {'impulse' : 0,
                        'thrustratio' : 0,
                        'dv' : 0,
                        'sumwetmass' : 0};
        stage.removePart = function(partid) {
            if (partid > -1 && typeof stage.partsList[partid] !== 'undefined') {
               stage.partsList.splice(partid, 1);
            }
            stage.result = stage.calculate(0);
        }
        stage.addPart = function(part) {
            var newpart = {'name' : part.name,
                           'wetmass' : part.wetmass,
                           'drymass' : part.drymass};
            var properties = ['impulseatm', 'impulsevac', 'thrustatm',
                              'thrustvac'];

            for (var i = 0; i < properties.length; i++) {
                newpart[properties[i]] = $scope.checkProperty(part, properties[i]);
            }
            stage.partsList.push(newpart);
        }
        stage.calculate = function(payloadMass) {
            var sumthrust, sumfuelused, totalimpulse, dv, sumwetmass,
                sumdrymass, thrustratio;
            sumthrust = sumfuelused = totalimpulse = dv = thrustratio = 0;
            // We need to account for the mass of all upper stages.
            sumdrymass = sumwetmass = payloadMass;

            for (var i = 0; i < stage.partsList.length; i++) {
                sumdrymass += stage.partsList[i].drymass;
                sumwetmass += stage.partsList[i].wetmass;
                var impulse, thrust;
                if (stage.atm) {
                    impulse = stage.partsList[i].impulseatm;
                    thrust = stage.partsList[i].thrustatm;
                } else {
                    impulse = stage.partsList[i].impulsevac;
                    thrust = stage.partsList[i].thrustvac;
                }
                if (impulse !== 0) {
                    sumthrust += thrust;
                    sumfuelused += thrust / impulse;
                }
            }
            if (sumfuelused !== 0) {
                totalimpulse = sumthrust / sumfuelused;
            }
            if (sumdrymass !== 0) {
                dv = Math.log(sumwetmass / sumdrymass)
                     * $scope.gravity * totalimpulse;
            }
            if (sumwetmass !== 0) {
                thrustratio = sumthrust / (sumwetmass * $scope.gravity);
            }
            return {'impulse' : totalimpulse,
                    'thrustratio' : thrustratio,
                    'dv' : dv,
                    'sumwetmass' : sumwetmass};
        }
        return stage;
    }
}]);

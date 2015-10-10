'use strict';

var deevee = angular.module('deeVee', ['ngRoute']);

deevee.controller('stageCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('parts/parts.json').success(function(data) {
      $scope.parts = data;
    });
    $scope.gravity = 9.81;
    $scope.checkProperty = function(part, property) {
        if (typeof part[property] === 'number') {
            return part[property];
        } else {
            return 0;
        }
    }
    $scope.stageList = [];
    $scope.addStage = function() {
        $scope.stageList.push($scope.newStage());
    }
    $scope.removeStage = function(stageIndex) {
        $scope.stageList.splice(stageIndex, 1);
        if ($scope.stageList.length > 0) {
            $scope.updateCalculations(stageIndex);
        }
    }
    $scope.addStagePart = function(stageIndex, part) {
        $scope.stageList[stageIndex].addPart(part);
        $scope.updateCalculations(stageIndex);
    }
    $scope.removeStagePart = function(stageIndex, partid) {
        $scope.stageList[stageIndex].removePart(partid);
        $scope.updateCalculations(stageIndex);
    }
    $scope.updateCalculations = function(stageIndex) {
        if (stageIndex === 0) {
            $scope.stageList[stageIndex].result = $scope.stageList[stageIndex].calculate(0);
            if ($scope.stageList.length > 0) {
                $scope.updateCalculations(1);
            }
        } else {
            for (var i = stageIndex; i < $scope.stageList.length; i++) {
                $scope.stageList[i].result = $scope.stageList[i].calculate($scope.stageList[i - 1].result['sumwetmass']);
            }
        }
    }
    $scope.newStage = function() {
        var stage = {};
        stage.partsList = [];
        stage.selected = $scope.parts[0];
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
            var properties = ['impulse', 'thrust'];

            for (var i = 0; i < properties.length; i++) {
                newpart[properties[i]] = $scope.checkProperty(part, properties[i]);
            }
            stage.partsList.push(newpart);
            stage.selected = stage.defaultSelected;
            stage.selected = $scope.parts[0];
        }
        stage.calculate = function(payloadMass) {
            var sumthrust, sumfuelused, totalimpulse, dv, sumwetmass,
                sumdrymass, thrustratio;
            sumthrust = sumfuelused = totalimpulse = dv = thrustratio = 0;
            sumdrymass = sumwetmass = payloadMass;

            for (var i = 0; i < stage.partsList.length; i++) {
                sumdrymass += stage.partsList[i].drymass;
                sumwetmass += stage.partsList[i].wetmass;
                if (stage.partsList[i].impulse !== 0) {
                    sumthrust += stage.partsList[i].thrust;
                    sumfuelused += stage.partsList[i].thrust
                                   / stage.partsList[i].impulse;
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

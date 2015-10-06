'use strict';

var deevee = angular.module('deeVee', ['ngRoute']);

deevee.controller('stageCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('parts/parts.json').success(function(data) {
      $scope.parts = data;
      $scope.selected = data[0];
    });
    $scope.result = '';
    $scope.gravity = 9.81;
    $scope.partsList = []
    $scope.checkProperty = function(part, property) {
        if (typeof part[property] === 'number') {
            return part[property];
        } else {
            return 0;
        }
    }
    $scope.removePart = function(partid) {
        if (partid > -1 && typeof $scope.partsList[partid] !== 'undefined') {
           $scope.partsList.splice(partid, 1);
        }
        $scope.result = $scope.calculate();
    }
    $scope.addPart = function(part) {
        var newpart = {'name' : part.name,
                       'wetmass' : part.wetmass,
                       'drymass' : part.drymass};
        var properties = ['impulse', 'thrust'];

        for (var i = 0; i < properties.length; i++) {
            newpart[properties[i]] = $scope.checkProperty(part, properties[i]);
        }
        $scope.partsList.push(newpart);
        $scope.selected = $scope.parts[0];
        $scope.result = $scope.calculate();
    }
    $scope.calculate = function() {
        var sumdrymass, sumwetmass, sumthrust, sumfuelused, totalimpulse, dv,
            thrustratio;
        sumdrymass = sumwetmass = sumthrust = sumfuelused = totalimpulse = dv
            = thrustratio = 0;

        for (var i = 0; i < $scope.partsList.length; i++) {
            sumdrymass += $scope.partsList[i].drymass;
            sumwetmass += $scope.partsList[i].wetmass;
            if ($scope.partsList[i].impulse !== 0) {
                sumthrust += $scope.partsList[i].thrust;
                sumfuelused += $scope.partsList[i].thrust
                               / $scope.partsList[i].impulse;
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
                'dv' : dv};
    }
}]);

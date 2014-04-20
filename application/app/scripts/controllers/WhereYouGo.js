'use strict';

angular.module('app')
	.controller('WhereYouGoCtrl', ['$scope', '$log', 'Destination', function ($scope, $log, Destination) {
		// $scope.$log = $log;
		$log.debug('WhereYouGoCtrl loaded');
		$scope.lat = 47.38974;
		$scope.lon = 0.68889;


		$scope.saveCoor = function(){
			Destination.setLon($scope.lon);
			Destination.setLat($scope.lat);
		};

	}]);
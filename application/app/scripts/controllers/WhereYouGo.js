'use strict';

angular.module('app')
	.controller('WhereYouGoCtrl', ['$scope', '$log', 'Destination', function ($scope, $log, Destination) {
		// $scope.$log = $log;
		$log.debug('WhereYouGoCtrl loaded');
		$scope.lon = '';
		$scope.lat = '';


		$scope.saveCoor = function(){
			Destination.setLon($scope.lon);
			Destination.setLat($scope.lat);
		};

	}]);
'use strict';

angular.module('app')
	.controller('ManageMapCtrl', ['$scope', '$log', '$http', 'DBGraph', function ($scope, $log, $http, DBGraph) {
		$scope.$log = $log;
		$scope.DBGraph = DBGraph;
		$log.debug('ManageMapCtrl loaded');
		$scope.perdu = 0;
		$scope.load = function(){
			$http.get('http://172.25.15.81').success(function(data, status, headers, config) {
				$scope.perdu=data || 'request failed';
				$log.debug('success : ' + status);
				$log.debug('success : ' + data);
			}).error(function(data, status) {
				$scope.perdu=data || 'request failed';
				$log.debug('error : ' + status);
				$log.debug('error : ' + data);
			});
		};
	}]);

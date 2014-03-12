'use strict';

angular.module('app')
	.controller('ManageMapCtrl', ['$scope', '$log', '$http', 'DBGraph', function ($scope, $log, $http, DBGraph) {
		$scope.$log = $log;
		$scope.DBGraph = DBGraph;

		$scope.hide = true;
		// $scope.urlServer = 'http://depot.pfe.local/out/';
		$scope.urlServer = 'http://172.25.15.81/out/';
		$scope.importState= '';
		$scope.step = '';
		$scope.size = '';

		$log.debug('ManageMapCtrl loaded');

		$scope.loadList = function(){
			$http.get($scope.urlServer + 'index.json').success(function(data, status) {

				$log.debug('success : ' + status);
				$log.debug('ListArea : ' + data.area);
				$scope.listArea=data.area || 'request failed';
				$scope.hide = false;
				
			}).error(function(data, status) {
				$scope.success=(data + ',' + status) || 'request failed';
			});
		};
		$scope.select = function(){
			$scope.importState = 'Downloading';
			$http.get($scope.urlServer + $scope.selected + '.json').success(function(data) {
				var step = {value : 0}; // object for passing by reference
				var size = data.features.length;

				$scope.importState = 'Importing : ';
				$scope.step = step;
				$scope.size = ' / '+size;

				for (var i = 0; i <= size; i++) {
					// DBGraph.addFast(data.features[i], step, i);
					DBGraph.add(data.features[i]);
				}
					
			}).error(function() {
				$scope.importState='Fail to Download area data';
			});
		};
	}]);

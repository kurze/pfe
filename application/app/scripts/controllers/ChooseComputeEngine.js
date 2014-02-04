'use strict';

angular.module('app')
	.controller('ChooseComputeEngineCtrl', ['$scope', '$log', 'ListeComputeEngine', function ($scope, $log, ListeCE) {
		$scope.listComputeEngine = [];

		$scope.ListeCE = ListeCE;

		$log.debug('number item ListeCE : ' + ListeCE.getLength());

		$scope.selected = ListeCE.selected;

		for (var i = ListeCE.getLength() - 1; i >= 0; i--) {
			$scope.listComputeEngine.push(ListeCE.getItem(i));
		}

		$scope.change = function(){
			ListeCE.selected = $scope.selected;
			$log.debug('Compute Engine selected : ' + ListeCE.selected);
		};
	}]);

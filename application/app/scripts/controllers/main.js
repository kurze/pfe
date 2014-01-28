'use strict';

angular.module('app')
	.controller('MainCtrl', function ($scope) {
		$scope.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
	})
	.controller('ChooseComputeEngineCtrl', ['$scope', '$log', 'ListeComputeEngine', function ($scope, $log, ListeCE) {
		$scope.listComputeEngine = [];

		$log.debug('number item ListeCE : '+ListeCE.getLength());

		for (var i = ListeCE.getLength() - 1; i >= 0; i--) {
			$scope.listComputeEngine.push(ListeCE.getItem(i));
		}

		$scope.change = function(){
			ListeCE.selected = $scope.selected;
			$log.debug(ListeCE.selected);
		};
	}]);
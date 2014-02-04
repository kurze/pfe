'use strict';
/* jshint sub: true */

angular.module('app')
	.controller('ChooseRenderEngineCtrl', ['$scope', '$log', 'ListeRenderEngine', function ($scope, $log, ListeRE) {

		$scope.listRenderEngine = Object;
		$scope.selected=ListeRE.selected;
		var mode;

		for (mode in ['video', 'audio', 'other']){
			$scope.listRenderEngine[mode] = [];
			$scope.selected[mode] = Object;
			ListeRE.selected[mode] = Object;
			$log.debug('number item ListeRE : ' + ListeRE.getLength());
		}

		$scope.ListeRE = ListeRE;

		for (mode in ['video', 'audio', 'other']){
			for (var i = ListeRE.getLength( mode ) - 1; i >= 0; i--) {
				$scope.listRenderEngine[mode].push(ListeRE.getItem(mode, i));
			}
		}
		
		$scope.change = function(mode){
			ListeRE.selected[mode] = $scope.selected[mode];
			$log.debug('Render Engine selected : ' + ListeRE.selected[mode]);
		};
	}]);

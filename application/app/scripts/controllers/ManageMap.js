'use strict';

angular.module('app')
	.controller('ManageMapCtrl', ['$scope', '$log', '$http', 'DBGraph', function ($scope, $log, $http, DBGraph) {
		$scope.$log = $log;
		$scope.DBGraph = DBGraph;

		$scope.hide = true;
		$scope.urlServer = 'http://depot.pfe.local/out/';
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
			$log.info('launch Download : ' + $scope.selected);
			$http.get($scope.urlServer + $scope.selected + '.json').success(function(data) {
				var step = 0;
				var size = data.features.length;
				$log.info(+ $scope.selected + ' downloaded successfully');

				$scope.importState = 'Importing : ';
				$scope.step = step;
				$scope.size = ' / '+size+' ('+((100.0 * step) / size)+'%)';

				var i = 0;
				var saveNextItem = null;
				saveNextItem = function(){
					if(i < size){
						// $log.info('saveNextItem '+i+' '+data.features[i].geometry.type);
						
						$scope.step = i;
						$scope.size = ' / '+size+' ('+((100.0 * i) / size).toFixed(3) +'%)';
						if(i > 1){
							$scope.$apply();
						}
						DBGraph.add(data.features[i++], saveNextItem);
					}else{
						DBGraph.saveState();
						$scope.$apply(function(){
							$scope.importState = 'Complete importation of '+size+' elements';
							$scope.step = '';
							$scope.size = '';
						});
					}
				};
				saveNextItem();
			}).error(function() {
				$scope.importState='Fail to Download area data';
			});
		};
	}]);
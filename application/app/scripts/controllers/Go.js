'use strict';

angular.module('app')
	.controller('GoCtrl', ['$scope', '$log', 'ListeComputeEngine', 'ListeRenderEngine', 'Destination', function ($scope, $log, ListeCE, ListeRE, Destination) {
		$scope.hideProgress = true;
		$scope.hideWarning = true;
		$scope.position = null;
		$scope.warning = '';


		$scope.forbidCompute = true;
		$scope.geolocationOK = false;
		$scope.CESelected = false;
		// $scope.RESelected = false;
		$scope.destinationSelected = false;
		function updateForbidCompute(){
			$scope.forbidCompute =
				!$scope.geolocationOK ||
				!$scope.CESelected ||
				// !$scope.RESelected &&
				!$scope.destinationSelected;
			console.log($scope.forbidCompute);
			$scope.$apply();
		}

		function verifyComputable(){
			if(ListeCE.selected === null){
				$scope.hideWarning = false;
				$scope.CESelected = false;
				$scope.warning += 'Choose a compute engine first<br/>';
			}else{
				$scope.CESelected = true;
			}

			// if(ListeRE.selected === null){
			// 	$scope.hideWarning = false;
			// 	$scope.RESelected = false;
			// 	$scope.warning += 'Choose a render engine first<br/>';
			// }else{
			// 	$scope.RESelected = true;
			// }
			
			if(Destination.getLat() === null || Destination.getLon() === null){
				$scope.destinationSelected = false;
			}else{
				$scope.destinationSelected = true;
			}
			updateForbidCompute();
		}
		verifyComputable();

		function geoSuccess(position) {
			$scope.position = position;
			$scope.geolocationOK = true;
			updateForbidCompute();
			console.log(position);
		}

		function geoError() {
			$scope.hideWarning = false;
			$scope.warning += 'Sorry, no position available.<br/>';
			$scope.geolocationOK = false;
			updateForbidCompute();
		}
		var wpid = navigator.geolocation.watchPosition(geoSuccess, geoError);

		var callBackComputeProgressCallNumber=0;
		var callBackComputeProgress = function(progress){
			$scope.progress = 'progress : ' + progress;

			if(callBackComputeProgressCallNumber++ > 0){
				$scope.$apply();
			}
			
		};
		
		var callBackComputeFinal = $.proxy(function(path){
			this.path = path;
		}, this);

		$scope.compute = function(){
			$scope.hideProgress = false;
			ListeCE.selected.computePath(
				[0, 0],
				Destination.get(),
				callBackComputeProgress,
				callBackComputeFinal
			);
		};
	}]);
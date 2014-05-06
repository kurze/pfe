'use strict';

angular.module('app')
	.controller('GoCtrl', ['$scope', '$log', 'ListeComputeEngine', 'ListeRenderEngine', 'Destination', 'Monitor', function ($scope, $log, ListeCE, ListeRE, Destination, Monitor) {
		$scope.hideProgress = true;
		$scope.hideWarning = true;
		$scope.hideREVideo = true;
		$scope.hideREAudio = true;
		$scope.position = null;
		$scope.warning = '';

		$scope.forbidCompute = true;
		$scope.geolocationOK = false;
		$scope.CESelected = false;
		$scope.RESelected = false;
		$scope.destinationSelected = false;
		var uFCnbCall = 0;
		function updateForbidCompute(){
			$scope.forbidCompute =
				!$scope.geolocationOK ||
				!$scope.CESelected ||
				!$scope.RESelected &&
				!$scope.destinationSelected;
			if(uFCnbCall++ > 0){
				$scope.$apply();
			}
		}

		function verifyComputable(){
			if(ListeCE.selected === null){
				$scope.hideWarning = false;
				$scope.CESelected = false;
				$scope.warning += 'Choose a compute engine first';
			}else{
				$scope.CESelected = true;
				$scope.CE = ListeCE.selected;
			}

			if(ListeRE.selected === null){
				$scope.hideWarning = false;
				$scope.RESelected = false;
				$scope.warning += 'Choose a render engine first<br/>';
			}else{
				$scope.RESelected = true;
			}
			
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
			$scope.warning = '';
			if(!$scope.computeLauch){
				updateForbidCompute();
			}else{
				Monitor.setGeolocation(position);
			}
		}

		function geoError() {
			$scope.hideWarning = false;
			$scope.warning += 'Sorry, no position available.';
			$scope.geolocationOK = false;
			if(!$scope.computeLauch){
				updateForbidCompute();
			}
		}

		var geoOptions = {
			// documentation @ https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
			enableHighAccuracy : false,
			maximumAge : 10000,
			timeout : 15000
		};

		navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);

		var callBackComputeProgressCallNumber=0;
		var callBackComputeProgress = function(progress){
			$scope.progress = 'progress : ' + progress;

			if(callBackComputeProgressCallNumber++ > 0){
				$scope.$apply();
			}
			
		};
		
		var callBackComputeFinal = $.proxy(function(rm){
			this.roadmap = rm;
			$scope.progress = 'complete';
			$scope.hideREAudio = false;
			$scope.hideREVideo = false;
			$scope.$apply();
			Monitor.setRenderEngine(ListeRE.selected.video);
			Monitor.setRoadMap(rm);
			Monitor.launch();
		}, this);

		$scope.compute = function(){
			$scope.hideProgress = false;
			$scope.computeLauch = true;
			ListeCE.selected.computePath(
				[$scope.position.coords.longitude, $scope.position.coords.latitude],
				Destination.get(),
				callBackComputeProgress,
				callBackComputeFinal
			);
		};
	}]);
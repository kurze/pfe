'use strict';

angular.module('app')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
	.controller('ChooseComputeEngineCtrl', ['$scope', 'CEHelloWorld', function ($scope, $CEHelloWorld) {
		$scope.ListComputeEngine = [];
		$scope.ListComputeEngine.push($CEHelloWorld);
	}]);
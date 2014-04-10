'use strict';

angular.module('app', [
	'ngResource',
	'ngRoute'
])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/chooseComputeEngine', {
				templateUrl: 'views/chooseComputeEngine.html',
				controller: 'ChooseComputeEngineCtrl'
			})
			.when('/chooseRenderEngine', {
				templateUrl: 'views/chooseRenderEngine.html',
				controller: 'ChooseRenderEngineCtrl'
			})
			.when('/manageMap', {
				templateUrl: 'views/manageMap.html',
				controller: 'ManageMapCtrl'
			})
			.when('/whereYouGo', {
				templateUrl: 'views/whereYouGo.html',
				controller: 'WhereYouGoCtrl'
			})
			.when('/go', {
				templateUrl: 'views/go.html',
				controller: 'GoCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	});

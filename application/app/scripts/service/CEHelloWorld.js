'use strict';

// create service ( name, dependency[])
angular.module('CEHelloWorld', []).
  value('version', '0.1');

// constructor
var CEHelloWorld = function() {
};

// create field in the service
//CEHelloWorld.prototype.version = 0.1;

// create method in the service
CEHelloWorld.prototype.getVersion = function() {
	return 0.1;
};

CEHelloWorld.prototype.getName = function() {
	return 'Hello World';
};

CEHelloWorld.prototype.getId = function() {
	return 'CEHelloWorld';
};

//attach service
angular.module('app').service('CEHelloWorld', CEHelloWorld);
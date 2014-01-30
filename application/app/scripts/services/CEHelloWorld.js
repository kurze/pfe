'use strict';

// constructor
var CEHelloWorld = function() {
};

/// Version of the Engine
CEHelloWorld.prototype.getVersion = function() {
	return 0.1;
};

/// Name of the Engine
CEHelloWorld.prototype.getName = function() {
	return 'Hello World';
};

/// Identifiant of the Engine
CEHelloWorld.prototype.getId = function() {
	return 'CEHelloWorld';
};

/// Mode of the Engine (off-line or on-line)
CEHelloWorld.prototype.getMode = function() {
	return 'off-line';
};

/// attache engine to the app as a service
angular.module('app').service('CEHelloWorld', CEHelloWorld);
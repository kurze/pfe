'use strict';

// constructor
var REHelloWorld = function() {
};

/// Version of the Engine
REHelloWorld.prototype.getVersion = function() {
	return 0.1;
};

/// Name of the Engine
REHelloWorld.prototype.getName = function() {
	return 'Hello World';
};

/// Identifiant of the Engine
REHelloWorld.prototype.getId = function() {
	return 'REHelloWorld';
};

/// Mode of the Engine (video, audio or other) 
REHelloWorld.prototype.getMode = function() {
	return 'video';
};

/// attache engine to the app as a service
angular.module('app').service('REHelloWorld', REHelloWorld);
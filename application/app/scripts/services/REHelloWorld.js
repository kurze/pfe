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

/// initialize context of view, keep empty if nothing need to be done
REHelloWorld.prototype.initialize = function(){
};


/// push complete roadmap, keep empty if not used
REHelloWorld.prototype.setRoadMap = function(rm){
	this.roadmap = rm;
};

/// function call in case of step change
REHelloWorld.prototype.setCurrentStep = function(step){
	this.step = step;
};

/// function call in case of geolocation change
REHelloWorld.prototype.setGeolocation = function(coord){
	this.postion = coord;
};


/// attache engine to the app as a service
angular.module('app').service('REHelloWorld', REHelloWorld);
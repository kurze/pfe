'use strict';

// constructor
var REBasic = function() {
};

/// Version of the Engine
REBasic.prototype.getVersion = function() {
	return 0.1;
};

/// Name of the Engine
REBasic.prototype.getName = function() {
	return 'Basic Rendering';
};

/// Identifiant of the Engine
REBasic.prototype.getId = function() {
	return 'REBasic';
};

/// Mode of the Engine (video, audio or other) 
REBasic.prototype.getMode = function() {
	return 'video';
};

REBasic.prototype.initialize = function(){
	console.log('REBasic initialize');
	var draw = SVG('REVideo').size(300, 300);
	var rect = draw.rect(100, 100).attr({ fill: '#f06' });
	var line = draw.line(0, 0, 100, 150).stroke({ width: 1 });
};

REBasic.prototype.setRoadMap = function(rm){
	this.roadmap = rm;
};

REBasic.prototype.setCurrentStep = function(step){
	this.step = step;
};

REBasic.prototype.setGeolocation = function(coord){
	this.postion = coord;
};



/// attache engine to the app as a service
angular.module('app').service('REBasic', REBasic);
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
	var draw = SVG('REVideo').size(320, 320);
	// var rect = draw.rect(300, 300).fill('none').stroke({width : 1});
	// var frame = draw.polygon('0,0, 0,320, 320,320, 320,0').fill('none').stroke({witdh:1});
	// var line = draw.line(0, 0, 100, 150).stroke({ width: 1});
	this.draw = draw;
};

REBasic.prototype.setRoadMap = function(rm){
	this.roadmap = rm;
};

REBasic.prototype.setCurrentStep = function(step){
	this.step = step;
	console.log(step);
};

REBasic.prototype.setGeolocation = function(coord){
	this.postion = coord;
	var prev = this.step[0].coordinates[this.step[0].coordinates.length-2];
	var cross = this.step[1].coordinates[0];
	var next = this.step[2].coordinates[1];
	var angle = this.calcAngle(cross, prev, next);
	angle = rad2deg(angle);
	console.log('angle', angle);
	this.baseArrow = this.draw.line(160,320, 160,160).stroke({width:1});
	this.endArrow = this.draw.line(160,320, 160,160).stroke({width:1});
	this.endArrow.rotate(angle, 160, 160);

};

function deg2rad(deg) {
	return deg * (Math.PI/180);
}
function rad2deg(rad) {
	return rad * (180/Math.PI);
}

REBasic.prototype.calcAngle = function(A, B, C){
	console.log('start calcAngle');
	var AB = this.calcDist(A, B);
	var AC = this.calcDist(A, C);
	var BC = this.calcDist(B, C);
	console.log(AB, AC, BC);
	var tmp1 = Math.pow(AB, 2) + Math.pow(AC, 2) - Math.pow(BC, 2);
	console.log(tmp1);
	var tmp2 = 2 * AB * AC;
	console.log(tmp2);
	return Math.acos(tmp1/tmp2);
};

REBasic.prototype.calcDist = function(start, end){
	var lat1 = start[0];
	var lon1 = start[1];
	var lat2 = end[0];
	var lon2 = end[1];

	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1);
	var a =
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c; // Distance in km
	return d;
};

/// attache engine to the app as a service
angular.module('app').service('REBasic', REBasic);
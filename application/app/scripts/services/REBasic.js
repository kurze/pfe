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
	this.arrow = [];
	this.arrow[0] = draw.line(160,320, 160,160).stroke({width:3});
	this.arrow[1] = draw.line(160,320, 160,160).stroke({width:3});
	this.arrow[2] = draw.line(160,320, 150,310).stroke({width:3});
	this.arrow[3] = draw.line(160,320, 170,310).stroke({width:3});
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
	angle = this.rad2deg(angle);
	console.log('angle', angle);
	for(var i =1; i< this.arrow.length; i++){
		this.arrow[i].rotate(angle, 160, 160);
	}

};

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
	var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
	var dLon = this.deg2rad(lon2-lon1);
	var a =
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c; // Distance in km
	return d;
};

REBasic.prototype.deg2rad = function(deg) {
	return deg * (Math.PI/180);
};
REBasic.prototype.rad2deg = function(rad) {
	return rad * (180/Math.PI);
};

/// attache engine to the app as a service
angular.module('app').service('REBasic', REBasic);
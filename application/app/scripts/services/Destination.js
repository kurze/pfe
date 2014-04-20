'use strict';

var Destination = function($log) {
	$log.debug('Destination loaded');
	this.$log = $log;

	this.longitude = null;
	this.latitude = null;
};

Destination.prototype.getLat = function(){
	this.$log.debug('Destination : getLat', this.latitude);
	return this.latitude;
};

Destination.prototype.getLon = function(){
	this.$log.debug('Destination : getLon', this.longitude);
	return this.longitude;
};

Destination.prototype.get = function(){
	this.$log.debug('Destination : get', this.longitude, this.latitude);
	return [this.longitude, this.latitude];
};

Destination.prototype.setLat = function(newValue){
	this.$log.debug('Destination : setLat',  this.latitude, ' -> ', newValue);
	this.latitude = newValue;
};

Destination.prototype.setLon = function(newValue){
	this.$log.debug('Destination : setLon',  this.longitude, ' -> ', newValue);
	this.longitude = newValue;
};

angular.module('app')
	.service('Destination', [
		'$log',
		Destination
	]);
'use strict';

var ListeRenderEngine = function($log) {

	this.$log = $log;
	this.liste = Object;
	this.liste.video = [];
	this.liste.audio = [];
	this.liste.other = [];

	for (var i = arguments.length - 1; i >= 1; i--) {
		if(arguments[i].getMode() === 'video'){
			this.liste.video.push(arguments[i]);
		}
		else if(arguments[i].getMode() === 'audio'){
			this.liste.audio.push(arguments[i]);
		}
		else{
			this.liste.other.push(arguments[i]);
		}
		$log.debug('add RE to list : '+arguments[i].getName());
	}
};

/// selected Compute Engine
ListeRenderEngine.prototype.selected = Object;
ListeRenderEngine.prototype.selected.video = null;
ListeRenderEngine.prototype.selected.audio = null;
ListeRenderEngine.prototype.selected.other = null;

/// retrieve one or all item in the list
ListeRenderEngine.prototype.getItem = function(liste, i) {
	if(arguments.length === 1){
		switch(liste){
		case 'video':
			return this.liste.video;
		case 'audio':
			return this.liste.audio;
		default:
			return this.liste.other;
		}
	}
	else if(arguments.length === 2){
		switch(liste){
		case 'video':
			return this.liste.video[i];
		case 'audio':
			return this.liste.audio[i];
		default:
			return this.liste.other[i];
		}
	}
	else{
		throw 'bad number of parameters';
	}
};

ListeRenderEngine.prototype.getLength = function(liste) {
	if(arguments.length === 1){
		switch(liste){
		case 'video':
			return this.liste.video.length;
		case 'audio':
			return this.liste.audio.length;
		default:
			return this.liste.other.length;
		}
	}else{
		return this.liste.other.concat(this.liste.audio, this.liste.video);
	}
};

angular.module('app')
	.service('ListeRenderEngine', [
		'$log',
		'REHelloWorld',
		'REBasic',
		// ^-- add new Render Engine here --^
		ListeRenderEngine
	]);
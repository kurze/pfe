'use strict';

var ListeRenderEngine = function($log) {
	var liste = [];

	this.$log = $log;
	this.liste = liste;

	for (var i = arguments.length - 1; i >= 1; i--) {
		this.liste.push(arguments[i]);
		$log.debug('add RE to list : '+arguments[i].getName());
	}
};

/// selected Compute Engine
ListeRenderEngine.prototype.selected = [];

/// retrieve one or all item in the list
ListeRenderEngine.prototype.getItem = function(i) {
	if(arguments.length===0){
		return this.liste;
	}
	else if(arguments.length===1){
		return this.liste[i];
	}
	else{
		throw 'bad number of parameters';
	}
};

ListeRenderEngine.prototype.getLength = function() {
	return this.liste.length;
};

angular.module('app')
	.service('ListeRenderEngine', [
		'$log',
		'REHelloWorld',
		// ^-- add new Compute Engine here --^
		ListeRenderEngine
	]);
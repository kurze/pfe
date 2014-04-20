'use strict';

var ListeComputeEngine = function($log) {
	var liste = [];

	this.$log = $log;
	this.liste = liste;

	for (var i = arguments.length - 1; i >= 1; i--) {
		this.liste.push(arguments[i]);
		$log.debug('add CE to list : '+arguments[i].getName());
	}
};

/// selected Compute Engine
ListeComputeEngine.prototype.selected = null;

/// retrieve one or all item in the list
ListeComputeEngine.prototype.getItem = function(i) {
	if(arguments.length === 0){
		return this.liste;
	}
	else if(arguments.length === 1){
		return this.liste[i];
	}
	else{
		throw 'bad number of parameters';
	}
};

ListeComputeEngine.prototype.getLength = function() {
	return this.liste.length;
};

angular.module('app')
	.service('ListeComputeEngine', [
		'$log',
		'CEHelloWorld',
		'CEDijkstra',
		// ^-- add new Compute Engine here --^
		ListeComputeEngine
	]);
'use strict';

// constructor
var CEDijkstra = function(DBGraph, GeoHash) {
	this.DBGraph = DBGraph;
	this.GeoHash = GeoHash;

};

/// Version of the Engine
CEDijkstra.prototype.getVersion = function() {
	return 0.1;
};

/// Name of the Engine
CEDijkstra.prototype.getName = function() {
	return 'Dijkstra';
};

/// Identifiant of the Engine
CEDijkstra.prototype.getId = function() {
	return 'CEDijkstra';
};

/// Mode of the Engine (off-line or on-line)
CEDijkstra.prototype.getMode = function() {
	return 'off-line';
};

CEDijkstra.prototype.computePath = function(source, destination, callbackProgress, callbackFinal) {
	var progress = 0;
	var path = Object;
	var graph = Object;
	
	console.log('computePath a');

	this.DBGraph.GetGraph().then($.proxy(function(record){
		console.log('computePath b');
		graph = record;

		console.log(source);
		source = this.DBGraph.searchNearestNode(source);
		console.log(source);

		console.log(destination);
		destination = this.DBGraph.searchNearestNode(destination);
		console.log(destination);

		this.dijkstra(graph, source, destination, callbackProgress, callbackFinal);
	}, this));
};

CEDijkstra.prototype.dijkstra = function(graph, srcGeoHash, dstGeoHash, callbackProgress, callbackFinal) {
	console.log('DIJKSTRA');
	console.log(srcGeoHash);
	console.log(dstGeoHash);
	var i=0;
	// for(var vertex = 0;  vertex < graph.length; vertex++){
	for(var vertex in graph){
		// console.log(this.GeoHash.decode(vertex));
		// i++;
		graph[vertex].distT = Number.POSITIVE_INFINITY;
		graph[vertex].prev = null;
		graph[vertex].visited = false;
		if(vertex === srcGeoHash){
			console.log('src found ', i);

		}else if (vertex === dstGeoHash){
			console.log('dst found ', i);
		}

	}

	graph[srcGeoHash].distT = 0;
	var searchNextVertex = function(){
		console.log('SEARCH------');
		var	distT = Number.POSITIVE_INFINITY;
		var nameV = '';
		console.log('a', i++);
		for(var vertex in graph){
			// console.log('b', i++);
			if( !graph[vertex].visited && graph[vertex].distT < distT){
				console.log('c', i++);
				nameV = vertex;
				distT = graph[vertex].distT;
			}
		}
		if(nameV === ''){
			console.log('chaine vide');
			return '';
		}
		graph[nameV].visited = true;
		console.log('SEARCH---end ', nameV);
		return nameV;
	};

	var progress = 1;
	callbackProgress(progress);

	for(vertex = searchNextVertex(); vertex !== ''; vertex = searchNextVertex()){
		callbackProgress(progress++);
		if(vertex === dstGeoHash){
			console.log('dst found');
			break;
		}

		for(var edge = 0;  edge < graph[vertex].length; edge++){
			// console.log('BOUCLE____2');
			var dist = graph[vertex][edge].dir;
			// console.log('graph[vertex].distT ', graph[vertex].distT);
			// console.log('graph[vertex][edge].dist ', graph[vertex][edge].dist);
			var newDist = graph[vertex].distT + graph[vertex][edge].dist;
			console.log(newDist);
			if(newDist <  graph[dist].distT){
				console.log('vertex', vertex, graph[vertex]);
				console.log('dist', dist, graph[dist]);
				graph[dist].distT = newDist;
				graph[dist].prev = vertex;
			}
		}
	}

	console.log(i++);
	console.log(graph);
	console.log(srcGeoHash);
	console.log(dstGeoHash);
	if(vertex === dstGeoHash){
		callbackFinal();
	}
};

angular.module('app').service('CEDijkstra', ['DBGraph', 'GeoHash', CEDijkstra]);
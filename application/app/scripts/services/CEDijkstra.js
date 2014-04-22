'use strict';

var EARTH_CIRCUMFERENCE = 40000;

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
	
	callbackProgress(0);

	this.DBGraph.GetGraph().then($.proxy(function(record){
		callbackProgress(1);
		graph = record;

		source = this.DBGraph.searchNearestNode(source);
		destination = this.DBGraph.searchNearestNode(destination);

		callbackProgress(2);

		this.dijkstra(graph, source, destination, callbackProgress, callbackFinal);
	}, this));
};

CEDijkstra.prototype.dijkstra = function(graph, srcGeoHash, dstGeoHash, callbackProgress, callbackFinal) {
	console.log('DIJKSTRA' ,graph);
	var i=0;
	var progress = 0;
 
	for(var vertex in graph){
		i++;
		graph[vertex].dijkstra = {
			distT : EARTH_CIRCUMFERENCE,
			prev : null,
			visited : false
		};
		if(vertex === srcGeoHash){
			console.log('src found ', i);

		}else if (vertex === dstGeoHash){
			console.log('dst found ', i);
		}

	}
	console.log('after search src & dst', i);

	graph[srcGeoHash].dijkstra.distT = 0;
	var searchNextVertex = function(){
		var	distT = EARTH_CIRCUMFERENCE;
		var nameV = '';
		for(var vertex in graph){
			if( !graph[vertex].dijkstra.visited && graph[vertex].dijkstra.distT < distT){
				nameV = vertex;
				distT = graph[vertex].dijkstra.distT;
			}
		}
		if(nameV === ''){
			console.log('chaine vide');
			return '';
		}
		graph[nameV].dijkstra.visited = true;
		return nameV;
	};

	var previousVertex;
	for(vertex = searchNextVertex(); vertex !== ''; vertex = searchNextVertex()){
		callbackProgress(progress++);
		if(progress > i+10){
			console.log('progress > i');
			break;
		}
		if(vertex === dstGeoHash){
			console.log('dst found');
			break;
		}
		if(previousVertex === vertex){
			console.log('previous = current');
			break;
		}
		previousVertex = vertex;

		for(var secondVertex in graph[vertex].edge){

			var newDist = graph[vertex].dijkstra.distT + graph[vertex].edge[secondVertex].dist;

			if(newDist <  graph[secondVertex].dijkstra.distT){
				graph[secondVertex].dijkstra.distT = newDist;
				graph[secondVertex].dijkstra.prev = vertex;
			}
		}
	}

	console.log(graph);
	console.log(srcGeoHash);
	console.log(dstGeoHash);
	if(vertex === dstGeoHash){
		callbackFinal();
	}
};

angular.module('app').service('CEDijkstra', ['DBGraph', 'GeoHash', CEDijkstra]);
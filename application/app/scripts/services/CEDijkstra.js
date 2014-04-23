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
	console.log('start computePath', Date.now()/1000%1000);
	var path = Object;
	callbackProgress(0);

	this.DBGraph.GetGraph().then($.proxy(function(graph){
		callbackProgress(1);
		// graph = record;

		source = this.DBGraph.searchNearestNode(source);
		destination = this.DBGraph.searchNearestNode(destination);
		console.log('research ok :', source, destination);
		callbackProgress(2);

		this.dijkstra(graph, source, destination, callbackProgress, callbackFinal);
	}, this));
};

CEDijkstra.prototype.dijkstra = function(graph, src, dst, callbackProgress, callbackFinal) {
	console.log('start dijkstra', Date.now()/1000%1000);
	var progress = 0;

	graph = this.initGraph(graph, src, dst);
	graph = this.simplify(graph);

	graph[src].dijkstra.distT = 0;

	var previousVertex;
	for(var vertex = this.searchNextVertex(graph); vertex !== ''; vertex = this.searchNextVertex(graph)){
		callbackProgress(progress++);
		if(vertex === dst){
			break;
		}
		if(previousVertex === vertex){
			break;
		}
		previousVertex = vertex;
		for(var secondVertex in graph[vertex].edge){
			if(graph[secondVertex]){
				var newDist = graph[vertex].dijkstra.distT + graph[vertex].edge[secondVertex].dist;

				if(newDist <  graph[secondVertex].dijkstra.distT){
					graph[secondVertex].dijkstra.distT = newDist;
					graph[secondVertex].dijkstra.prev = vertex;
				}
			}
		}
	}

	if(vertex === dst){
		console.log('dijkstra done', Date.now()/1000%1000);
		callbackFinal();
	}
};

CEDijkstra.prototype.searchNextVertex = function(graph){
	var	distT = EARTH_CIRCUMFERENCE;
	var nameV = '';
	for(var vertex in graph){
		if( !graph[vertex].dijkstra.visited && graph[vertex].dijkstra.distT < distT){
			nameV = vertex;
			distT = graph[vertex].dijkstra.distT;
		}
	}
	if(nameV === ''){
		console.log('chaine vide', Date.now()/1000%1000);
		return '';
	}
	graph[nameV].dijkstra.visited = true;
	return nameV;
};

CEDijkstra.prototype.initGraph = function(graph, src, dst){
	var i = 0;
	for(var vertex in graph){
		i++;
		graph[vertex].dijkstra = {
			distT : EARTH_CIRCUMFERENCE,
			prev : null,
			visited : false
		};
		if(vertex === src){
			console.log('src found ', i);
			graph[vertex].dijkstra.src = true;

		}else if (vertex === dst){
			console.log('dst found ', i);
			graph[vertex].dijkstra.dst = true;
		}

	}
	console.log('graph size :', i);
	return graph;
};

CEDijkstra.prototype.simplify = function(graph){
	var i = 0;
	for(var vertex in graph){
		var k=0;
		/* jshint unused: false */
		for(var edge in graph[vertex].edge){
			k++;
		}
		if(k === 2 && !( graph[vertex].dijkstra.src || graph[vertex].dijkstra.dst)){
			var dir = [];
			i = 0;
			for(var j in graph[vertex].edge){
				dir[i++] = j;
			}
			if(graph[dir[0]]){
				if(!graph[dir[0]].edge[dir[1]]){
					graph[dir[0]].edge[dir[1]] = {};
					graph[dir[0]].edge[dir[1]].dist =
							graph[vertex].edge[dir[0]].dist +
							graph[vertex].edge[dir[1]].dist;
					delete(graph[dir[0]].edge[vertex]);
				}
			}

			if(graph[dir[1]]){
				if(!graph[dir[1]].edge[dir[0]]){
					graph[dir[1]].edge[dir[0]] = {};
					graph[dir[1]].edge[dir[0]].dist =
							graph[vertex].edge[dir[1]].dist +
							graph[vertex].edge[dir[0]].dist;
					delete(graph[dir[1]].edge[vertex]);
				}
			}
			delete(graph[vertex]);
		}
	}
	return graph;
};

angular.module('app').service('CEDijkstra', ['DBGraph', 'GeoHash', CEDijkstra]);
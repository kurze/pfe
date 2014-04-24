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
	var roadmap = Object;
	callbackProgress(0);

	this.DBGraph.GetGraph().then($.proxy(function(graph){
		callbackProgress(1);
		// graph = record;

		source = this.DBGraph.searchNearestNode(source);
		destination = this.DBGraph.searchNearestNode(destination);
		console.log('research ok :', source, destination);
		callbackProgress(2);

		graph = this.dijkstra(graph, source, destination, callbackProgress);
		roadmap = this.extractPath(graph, source, destination);
		console.log('end computePath', Date.now()/1000%1000);
		callbackFinal(roadmap);
	}, this));
};

CEDijkstra.prototype.dijkstra = function(graph, src, dst, callbackProgress) {
	console.log('start dijkstra', Date.now()/1000%1000);
	var progress = 0;

	graph = this.initGraph(graph, src, dst);
	console.log('initGraph done', Date.now()/1000%1000);
	graph = this.simplify(graph);
	console.log('simplify done', Date.now()/1000%1000);

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
		return graph;
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

	var removeVertex = function(v, d0, d1){
		if(graph[d0]){
			if(!graph[d0].edge[d1]){
				graph[d0].edge[d1] = {};

				graph[d0].edge[d1].dist =
						graph[v].edge[d0].dist +
						graph[v].edge[d1].dist;

				if(!graph[d0].edge[d1].step){
					graph[d0].edge[d1].step = [];
				}
				graph[d0].edge[d1].step.push(v);

				delete(graph[d0].edge[v]);
			}
		}
	};

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

			removeVertex(vertex, dir[0], dir[1]);
			removeVertex(vertex, dir[1], dir[0]);
			delete(graph[vertex]);
		}
	}
	return graph;
};

/**
 * extractPath from graph with dijkstra data to geojson format
 * @param  {[type]} graph graph with dijkstra data
 * @return {[type]}       roadmap in geojson (object with struct describe by geojson)
 */
CEDijkstra.prototype.extractPath = function(graph, src, dst){
	// console.log('extractPath', Date.now()/1000%1000);
	var currentVertex = dst;
	var roadmap = {
		type : 'FeatureCollection',
		features : []
	};

	var tmpArrayStep = [];

	// var step = {
	// 	type: 'Feature',
	// 	// properties : {
	// 	// 	distance : 0
	// 	// },
	// 	geometry : {
	// 		type : 'LineString',
	// 		coordinates : []
	// 	}
	// };

	var addToStep = $.proxy(function(step, coor){
		step.geometry.coordinates.push(
			this.GeoHash.decodeSimple(
				coor
			)
		);
	}, this);

	while(currentVertex !== src){

		var tmpStep = {
			type: 'Feature',
			properties : {
				distance : 0
			},
			geometry : {
				type : 'LineString',
				coordinates : []
			}
		};
		var prev = graph[currentVertex].dijkstra.prev;

		addToStep(tmpStep, prev);

		for(var i in graph[prev].edge[currentVertex].step){
			if(i%3===0){
				addToStep(tmpStep, graph[prev].edge[currentVertex].step[i]);
			}
		}

		addToStep(tmpStep, currentVertex);

		tmpArrayStep.push(tmpStep);
		currentVertex = prev;
	}

	for (var j = tmpArrayStep.length - 1; j >= 0; j--) {
		roadmap.features.push(tmpArrayStep[j]);
	}
	console.log(roadmap);
	console.log(JSON.stringify(roadmap));
	return roadmap;
};

angular.module('app').service('CEDijkstra', ['DBGraph', 'GeoHash', CEDijkstra]);
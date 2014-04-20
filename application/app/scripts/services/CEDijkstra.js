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
	
	var srcGeoHash = this.GeoHash.encode(source);
	var dstGeoHash = this.GeoHash.encode(destination);

	this.DBGraph.GetGraph().then($.proxy(function(record){
		graph = JSON.parse(record);

		this.dijkstra(graph, srcGeoHash, dstGeoHash, callbackProgress, callbackFinal);
	}, this));
};

CEDijkstra.prototype.dijkstra = function(graph, srcGeoHash, dstGeoHash, callbackProgress, callbackFinal) {
	console.log('DIJKSTRA');
	console.log(srcGeoHash);
	console.log(dstGeoHash);
	srcGeoHash = 'mj8n3bmm6';
	// console.log(graph.length);
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

/// attache engine to the app as a service
angular.module('app').service('CEDijkstra', ['DBGraph', 'GeoHash', CEDijkstra]);

/*
 1  function Dijkstra(Graph, source):
 2      for each vertex v in Graph:                                // Initializations
 3          dist[v]  := infinity ;                                  // Unknown distance function from 
 4                                                                 // source to v
 5          previous[v]  := undefined ;                             // Previous node in optimal path
 6      end for                                                    // from source
 7      
 8      dist[source]  := 0 ;                                        // Distance from source to source
 9      Q := the set of all nodes in Graph ;                       // All nodes in the graph are
10                                                                 // unoptimized – thus are in Q
11      while Q is not empty:                                      // The main loop
12          u := vertex in Q with smallest distance in dist[] ;    // Source node in first case
13          remove u from Q ;
14          if dist[u] = infinity:
15              break ;                                            // all remaining vertices are
16          end if                                                 // inaccessible from source
17          
18          for each neighbor v of u:                              // where v has not yet been 
19                                                                 // removed from Q.
20              alt := dist[u] + dist_between(u, v) ;
21              if alt < dist[v]:                                  // Relax (u,v,a)
22                  dist[v]  := alt ;
23                  previous[v]  := u ;
24                  decrease-key v in Q;                           // Reorder v in the Queue (that is, heapify-down) 
25              end if
26          end for
27      end while
28      return dist[], previous[];
29  end function
//*/

'use strict';

var KEY_GRAPH = 'graph';

var DBGraph = function(GeoHash) {

	this.GeoHash = GeoHash;

	this.graph = {};

	localforage.getItem(KEY_GRAPH).then($.proxy(function(record){
		this.graph = JSON.parse(record);
		if(this.graph === null){
			this.graph = {};
		}
	}, this));

	// implement startsWith if not exist
	if (!String.prototype.startsWith) {
		Object.defineProperty(String.prototype, 'startsWith', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: function (searchString, position) {
				position = position || 0;
				return this.indexOf(searchString, position) === position;
			}
		});
	}
};

DBGraph.prototype.count = function(graph){
	var truc = [];
	var i = 0;
	var j = 0;
	for(var vertex in graph){
		i = 0;
		j++;
		/* jshint unused: false */
		for(var edge in graph[vertex].edge){
			i++;
		}
		if(!truc[i]){
			truc[i] = 1;
		}else{
			truc[i] = truc[i] + 1;
		}
	}
	console.log('graph conn :', truc);
	console.log('graph size :', j);
};

DBGraph.prototype.simplify = function(graph){
	var i = 0;
	for(var vertex in graph){
		var k=0;
		/* jshint unused: false */
		for(var edge in graph[vertex].edge){
			k++;
		}
		if(k === 2){
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

DBGraph.prototype.saveState = function(){
	this.count(this.graph);
	localforage.setItem(KEY_GRAPH, JSON.stringify(this.graph));
	console.log(this.graph);
};

DBGraph.prototype.addLineToGraph = function(line){
	for(var i=1; i < line.geometry.coordinates.length; i++){
		var end = line.geometry.coordinates[i-1];
		var start = line.geometry.coordinates[i];
		// console.log(end[0]);
		// console.log(end[1]);
		var hashEnd = this.GeoHash.encode(end);
		var hashStart = this.GeoHash.encode(start);
		
		var dist = this.calcLength(start, end);

		if(!this.graph[hashStart]){
			this.graph[hashStart] = {};
		}
		if(!this.graph[hashStart].edge){
			this.graph[hashStart].edge = {};
		}
		if(!this.graph[hashEnd]){
			this.graph[hashEnd] = {};
		}
		if(!this.graph[hashEnd].edge){
			this.graph[hashEnd].edge = {};
		}

		this.graph[hashStart].edge[hashEnd] = {};
		this.graph[hashStart].edge[hashEnd].dist = dist;

		this.graph[hashEnd].edge[hashStart] = {};
		this.graph[hashEnd].edge[hashStart].dist = dist;
		// console.log(start, end, hashStart, hashEnd);
	}
};

function deg2rad(deg) {
	return deg * (Math.PI/180);
}

DBGraph.prototype.calcLength = function(start, end){
	var lat1 = start[0];
	var lon1 = start[1];
	var lat2 = end[0];
	var lon2 = end[1];

	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1);
	var a =
		Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c; // Distance in km
	return d;
};

DBGraph.prototype.calcLineLength = function(line){
	var dist = 0;
	for(var i = 1; i < line.geometry.coordinates.length; i++){
		dist += this.calcLength(line.geometry.coordinates[i-1], line.geometry.coordinates[i]);
	}
	return dist;
};

DBGraph.prototype.add = function(thing, callback){
	if(thing.geometry.type === 'LineString'){
		this.addLineToGraph(thing);
	}
	if(callback !== null && callback !== undefined){
		callback();
	}
};

DBGraph.prototype.GetGraph = function(){
	return new Promise($.proxy(function(resolve) {
		if(this.graph === {}){
			localforage.getItem(KEY_GRAPH).then(function(record){
				record = JSON.parse(record);
				this.graph = record;
				resolve(record);
			});
		}else{
			resolve(this.graph);
		}
	}, this));
};

DBGraph.prototype.searchNearestNode = function(coord){
	this.GetGraph();
	var precision  = this.GeoHash.PRECISION;
	var found = false;
	var result;
	while(!found && precision > 0){
		var argEncode = [
			coord[0],
			coord[1],
			precision--
		];
		var hash = this.GeoHash.encode(argEncode);
		for(var vertex in this.graph){
			if(vertex.startsWith(hash)){
				found = true;
				result = vertex;
				break;
			}
		}
	}
	console.log('searchNearestNode :', result);
	return result;
};

/// attache engine to the app as a service
angular.module('app').service('DBGraph', ['GeoHash', DBGraph]);
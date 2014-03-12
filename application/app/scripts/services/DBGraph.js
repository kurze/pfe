'use strict';

// TODO : see localforge to evnetually replace ydn
// TODO : split index, node and edge in different store

// constructor
var DBGraph = function() {

	this.db = new ydn.db.Storage('DBGraph');

	this.NextKeyIndex = 1;
	this.db.put('index', {}, '0');
	this.db.count('index').done(function(x) {
		if(x > 1){
			this.addBaseIndex();
			this.NextKeyIndex = 1;
		}else{
			this.NextKeyIndex = x;
		}
	}).fail(function(){
		this.addBaseIndex();
		this.NextKey = 1;
	});

	this.db.put('node', {}, '0');
	this.db.count('node').done(function(x) {
		if(x >= 1){
			this.NextKey = 1;
		}else{
			this.NextKey = x;
		}
	});
	this.db.put('line', {}, '0');
};

DBGraph.prototype.threshold = 10;

DBGraph.prototype.addBaseIndex = function() {
	// root of the quadtree
	var root = {
		N : 90,
		S : -90,
		W : -180,
		E : 180,
		// NW : 1,
		// NE : 2,
		// SW : 3,
		// SE : 4,
		p : []
	};
	this.db.add('graph', root, '0');


};

DBGraph.prototype.add = function(thing){
	if(thing.geometry.type === 'Point'){
		this.addNode(thing);
	}else if(thing.geometry.type === 'LineString'){
		this.addLine(thing);
	}
};

// var NextKey = 0;
// DBGraph.prototype.addFast = function(thing, step, id){
// 	if(this.NextKey === undefined){
// 		this.NextKey = 0;
// 	}
// 	localforage.setItem(id.toString(), thing, function() {
// 		NextKey++;
// 		step.value++;
// 		console.log(step.value);
// 	});
// };

DBGraph.prototype.addNode = function(node, idQuad) {
	// root of the quadtree
	if(idQuad === undefined){
		idQuad = 0;
	}
	var id = this.NextKey;
	console.log('addNode idQuad : ' + idQuad);

	this.db.get('graph', idQuad.toString()).always(function(record) {
		if(record.p === undefined){

			if(node.geometry.coordinates[0] > (record.N+record.S)/2 ){
				if(node.geometry.coordinates[1] > (record.W+record.E)/2 ){
					id = this.addNode(node, record.NW);
				}else{
					id = this.addNode(node, record.NE);
				}
			}else{
				if(node.geometry.coordinates[1] > (record.W+record.E)/2 ){
					id = this.addNode(node, record.SW);
				}else{
					id = this.addNode(node, record.SE);
				}
			}

		}else if(record.p.length <= this.threshold){
			id = this.NextKey++;
			this.db.add('graph', node, id.toString());
			record.p.push(this.NextKey);
			this.db.put('graph', record, idQuad.toString());

		}else{

			this.divideQuad(record, idQuad);

		}
	});
	return id;
};

DBGraph.prototype.divideQuad = function(record, idQuad){
	var r = record;
	r.NW = this.NextKey++;
	r.NE = this.NextKey++;
	r.SW = this.NextKey++;
	r.SE = this.NextKey++;
	var NW = {
		N : r.N,
		S : (r.N+r.S)/2.0,
		W : r.W,
		E : (r.W+r.E)/2.0,
		p : []
	};
	var NE = {
		N : r.N,
		S : (r.N+r.S)/2.0,
		W : (r.W+r.E)/2.0,
		E : r.E,
		p : []
	};
	var SW = {
		N : (r.N+r.S)/2.0,
		S : r.S,
		W : r.W,
		E : (r.W+r.E)/2.0,
		p : []
	};
	var SE = {
		N : (r.N+r.S)/2.0,
		S : r.S,
		W : (r.W+r.E)/2.0,
		E : r.E,
		p : []
	};

	var NodeToMove = r.p;
	r.p = undefined;

	this.db.add('graph', NW, r.NW.toString());
	this.db.add('graph', NE, r.NE.toString());
	this.db.add('graph', SW, r.SW.toString());
	this.db.add('graph', SE, r.SE.toString());
	this.db.add('graph', r, idQuad.toString());

	for(var node in NodeToMove){
		this.addNode(node, idQuad);
	}
};

DBGraph.prototype.delete = function(id){
	if(id === undefined){
		id = 0;
	}
	this.db.get('graph', id.toString()).done(function(r){
		if(r.p !== undefined){
			for(var idNode in r.p){
				this.db.clear('graph', idNode.toString());
			}
		}else{
			this.delete(r.NW);
			this.delete(r.NE);
			this.delete(r.SW);
			this.delete(r.SE);
		}
		this.db.clear('graph', id.toString());
	});
};

DBGraph.prototype.deleteAll = function(){
	this.db.clear('graph');
};

DBGraph.prototype.searchNode = function(coord, idQuad){
	if(idQuad === undefined){
		idQuad = 0;
	}

	this.db.get('graph', idQuad.toString()).always(function(record) {
		var r = record;
		var result = null;
		if(r.p === undefined){
			if(Math.abs(coord[0]) < Math.abs(r.N) && Math.abs(coord[0]) > Math.abs((r.N+r.S)/2)){
				if(Math.abs(coord[1]) < Math.abs(r.E) && Math.abs(coord[0]) > Math.abs((r.E+r.W)/2)){
					result = this.searchNode(coord, r.NW);
				}else{
					result = this.searchNode(coord, r.NE);
				}
			}else{
				if(Math.abs(coord[1]) < Math.abs(r.E) && Math.abs(coord[0]) > Math.abs((r.E+r.W)/2)){
					result = this.searchNode(coord, r.SW);
				}else{
					result = this.searchNode(coord, r.SE);
				}
			}
			if(result === undefined){
				var tmp = [];
				tmp.push(this.searchNode(coord, r.NW));
				tmp.push(this.searchNode(coord, r.NE));
				tmp.push(this.searchNode(coord, r.SW));
				tmp.push(this.searchNode(coord, r.SE));
				for(var row in tmp){
					if(result === null || result.dist > row.dist){
						result = row;
					}
				}
			}
			return result;
		}else{// leaf
			var bestDist = null;
			var best = null;
			var compareDistNode = function(record){
				var x = record.geometry.coordinates[0] - coord[0];
				var y = record.geometry.coordinates[1] - coord[1];
				var dist = Math.sqrt(Math.pow(x) + Math.pow(y));
				if(bestDist=== null || bestDist > dist){
					bestDist = dist;
					best = record;
					best.dist = bestDist;
				}
			};
			for(var i in r.p){
				this.db.get('graph', i.toString()).always(compareDistNode(record));
			}
			return best;
		}
	});
};

DBGraph.prototype.addLine = function(LineString){

	var idLine = this.NextKey++;
	this.db.add('graph', LineString, idLine.toString());


	for(var coor in LineString.geometry.coordinates){
		var node = {
			'geometry' : {
				'type' : 'point',
				'coordinates' : coor,
				'idLine' : idLine
			}
		};
		/*
		var node = 0;
		node.geometry = 0;
		node.geometry.type = 'point';
		node.geometry.coordinates = coor;
		node.geometry.idLine = idLine;
		*/
		this.addNode(node);
	}
};

/// attache engine to the app as a service
angular.module('app').service('DBGraph', DBGraph);
'use strict';

// constructor
var DBGraph = function() {
	this.db = new ydn.db.Storage('graph');
	this.db.count('graph').done(function(x) {
		if(x > 1){
			this.addBaseIndex();
			this.NextKey = 1;
		}else{
			this.NextKey = x;
		}
	});

	this.thresold = 10;
};

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
	this.db.add('graph', root, 0);


};

DBGraph.prototype.addNode = function(node, idQuad) {
	// root of the quadtree
	if(idQuad === null){
		idQuad = 0;
	}
	var id = this.NextKey;

	this.db.get('graph', idQuad).always(function(record) {
		if(record.p === null){

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

		}else if(record.p.length <= this.thresold){
			id = this.NextKey++;
			this.db.add('graph', node, id);
			record.p.push(this.NextKey);
			this.db.put('graph', record, idQuad);

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

	this.db.add('graph', NW, r.NW);
	this.db.add('graph', NE, r.NE);
	this.db.add('graph', SW, r.SW);
	this.db.add('graph', SE, r.SE);
	this.db.add('graph', r, idQuad);

	for(var node in NodeToMove){
		this.addNode(node, idQuad);
	}
};
/*
DBGraph.prototype.searchNode = function(record, idQuad){


}
*/
DBGraph.prototype.addLine = function(LineString){

	var idLine = this.NextKey++;
	this.db.add('graph', LineString, idLine);


	for(var coor in geometry.coordinates){
		var node;
		node.geometry.type = 'point';
		node.geometry.coordinates = coor;
		node.geometry.idLine = idLine;
		this.addNode(node);
	}
}

/// attache engine to the app as a service
angular.module('app').service('DBGraph', DBGraph);
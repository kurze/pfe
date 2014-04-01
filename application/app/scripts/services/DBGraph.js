'use strict';

var DBGraph = function() {

	// this.NextKey=JSON.parse(''id' : 0');
	this.NextKey = 0;
	localforage.getItem('NextKey').then($.proxy(function(value){
		if(value === null){
			console.log('DBGraph NextKey : '+ value);
			value = 0;
			localforage.setItem('NextKey',this.NextKey.toString());
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
			localforage.setItem('rootQuadTree', JSON.stringify(root));
			console.log('DBGraph getEnd : ', JSON.stringify(root));
		}
		this.NextKey = parseInt(value);
	}, this));
	this.threshold=10;

};

DBGraph.prototype.saveNextKey = function(){
	localforage.setItem('NextKey',this.NextKey.toString());
};

DBGraph.prototype.add = function(thing, callback){
	thing = this.cleanThing(thing);
	if(thing.geometry.type === 'Point'){
		this.addNode(thing, callback);
	}else if(thing.geometry.type === 'LineString'){
		this.addLine(thing, callback);
	}else{
		if(callback !== null) {
			callback();
		}
	}
};

DBGraph.prototype.cleanThing = function(thing){
	delete(thing.properties);
	return thing;
};

DBGraph.prototype.addNode = function(node, callback) {
	this._addNode(node, 'rootQuadTree', callback);
};

DBGraph.prototype.chooseBranch = function(treeNode, nodeToAdd, callback){
	if(nodeToAdd.geometry.coordinates[0] > (treeNode.N+treeNode.S)/2 ){
		if(nodeToAdd.geometry.coordinates[1] > (treeNode.W+treeNode.E)/2 ){
			this._addNode(nodeToAdd, treeNode.NW, callback);
		}else{
			this._addNode(nodeToAdd, treeNode.NE, callback);
		}
	}else{
		if(nodeToAdd.geometry.coordinates[1] > (treeNode.W+treeNode.E)/2 ){
			this._addNode(nodeToAdd, treeNode.SW, callback);
		}else{
			this._addNode(nodeToAdd, treeNode.SE, callback);
		}
	}
};

DBGraph.prototype._addNode = function(nodeToAdd, idQuad, callback) {
	localforage.getItem(idQuad.toString()).then($.proxy(function(record){
		record = JSON.parse(record);
		// current node of the tree is not a leaf, continue to move down
		if(record.p === undefined){
			this.chooseBranch(record, nodeToAdd, callback);

		// leaf not full
		}else if(record.p.length <= this.threshold){

			var idNode = this.NextKey++;
			localforage.setItem(idNode.toString(), JSON.stringify(nodeToAdd));
			record.p.push(idNode);
			localforage.setItem(idQuad.toString(), JSON.stringify(record));
			if(callback !== null){
				callback();
			}

		// leaf full => divide it in 4 parts
		}else{
			this.divideQuad(record, idQuad, $.proxy(function(){
				this._addNode(nodeToAdd, idQuad, callback);
			}, this));
		}
	}, this));
};

DBGraph.prototype.addLine = function(LineString, callback){
	var idLine = this.NextKey++;
	// save line
	localforage.setItem(idLine.toString(), JSON.stringify(LineString));

	// save each point of the line in the quadtree
	var i  = 0;
	var saveNextNode = null;
	saveNextNode = $.proxy(function(){
		if(i < LineString.geometry.coordinates.length){
			var node = {
				geometry : {
					type : 'point',
					coordinates : LineString.geometry.coordinates[i++],
					idLine : idLine
				}
			};

			this.addNode(node, saveNextNode);
		}else{
			if(callback !== null){
				callback();
			}
		}
	}, this);
	saveNextNode();
};

/**
 * divide a leaf of the quadtree into 4 leafs
 * @param  {nodeQuadTree} record the node to divide
 * @param  {int} idQuad idea of the node to divide
 */
DBGraph.prototype.divideQuad = function(record, idQuad, callback){
	console.log('divideQuad');
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

	localforage.setItem(r.NW.toString(), JSON.stringify(NW));
	localforage.setItem(r.NE.toString(), JSON.stringify(NE));
	localforage.setItem(r.SW.toString(), JSON.stringify(SW));
	localforage.setItem(r.SE.toString(), JSON.stringify(SE));
	localforage.setItem(idQuad.toString(), JSON.stringify(r));

	var i = 0;
	var addNextNode = null;
	addNextNode = $.proxy(function(){
		if(i < NodeToMove.length){

			localforage.getItem(NodeToMove[i].toString()).then($.proxy(function(item){
				item = JSON.parse(item);
				localforage.removeItem(NodeToMove[i]);
				this._addNode(item, idQuad, addNextNode);
				i++;

			}, this));

		}else if(callback !== null){
			callback();
		}
	}, this);
	addNextNode();
};

/**
 * return nearest point available in the db
 * @param  {[2]float} coord coordinates to aproach
 * @return nearest node 
 */
DBGraph.prototype.searchNode = function(coord){
	return new Promise($.proxy(function(resolve, reject) {
		this.searchNodeInTree(coord, 'rootQuadTree').then(function(record){
			resolve(record);
		}, function(err){
			reject(err);
		});

	}, this));
};

DBGraph.prototype.searchNodeInTree = function(coord, idQuad){

	//initialize promise
	return new Promise($.proxy(function(resolve) {
		// this.db.get('graph', idQuad.toString()).always(function(record) {
		localforage.getItem(idQuad.toString()).then($.proxy(function(record){
			var r = JSON.parse(record);
			var result = [];
			// test if it's a leaf
			if(r.p === undefined){ // not a leaf
				// compute which branch to follow
				if(Math.abs(coord[0]) < Math.abs(r.N) && Math.abs(coord[0]) > Math.abs((r.N+r.S)/2)){
					if(Math.abs(coord[1]) < Math.abs(r.E) && Math.abs(coord[0]) > Math.abs((r.E+r.W)/2)){
						result.push(this._searchNode(coord, r.NW));
					}else{
						result.push(this._searchNode(coord, r.NE));
					}
				}else{
					if(Math.abs(coord[1]) < Math.abs(r.E) && Math.abs(coord[0]) > Math.abs((r.E+r.W)/2)){
						result.push(this._searchNode(coord, r.SW));
					}else{
						result.push(this._searchNode(coord, r.SE));
					}
				}
				// if no result in the branch follow (empty leaf), combine all branch of this level
				if(result === undefined){
					result.push(this._searchNode(coord, r.NW));
					result.push(this._searchNode(coord, r.NE));
					result.push(this._searchNode(coord, r.SW));
					result.push(this._searchNode(coord, r.SE));
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
				resolve(best);
			}
		}, this));
	}, this));
};

/// attache engine to the app as a service
angular.module('app').service('DBGraph', DBGraph);
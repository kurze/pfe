'use strict';

var Monitor = function(GeoHash) {
	this.GeoHash = GeoHash;
	this.stepNumber = 0;
	this.step = [];
};

Monitor.prototype.setComputeEngine = function(ce) {
	this.computeEngine = ce;
};

Monitor.prototype.setRenderEngine = function(re) {
	this.renderEngine = re;
};

Monitor.prototype.setRoadMap = function(rm) {
	this.roadMap = rm;
	if(this.renderEngine !== undefined){
		this.renderEngine.setRoadMap(rm);
	}
};

Monitor.prototype.setGeolocation = function(pos){
	this.position = pos;

	var vertex = [];
	var biggestAngle = 0;
	var newCurrentStep = this.stepNumber;
	for(var i=0; i<this.step.length; i++){
		for(var j=0; j<this.step[i].coordinates.length; j++){
			vertex[0] = this.step[i].coordinates[j];
			if(j===this.step[i].coordinates.length-1 && i < this.step.length-1){
				vertex[1] = this.step[i+1].coordinates[0];
			}else if(j < this.step[i].coordinates.length-1){
				vertex[1] = this.step[i].coordinates[j];
			}else{
				continue;
			}
			var angle = this.calcAngle(this.position, vertex[0], vertex[1]);
			angle = angle % Math.PI;
			if(biggestAngle < angle){
				biggestAngle = angle;
				newCurrentStep = i;
			}
		}
	}
	this.stepNumber = newCurrentStep;
	for(i = 0; i < 3; i++){
		this.step[i] = this.roadMap.features[this.stepNumber+i].geometry;
	}
	if(this.renderEngine !== undefined){
		this.renderEngine.setCurrentStep(this.step);
		this.renderEngine.setGeolocation(this.position);
	}

};

Monitor.prototype.launch = function(){
	var step = [];
	for(var i = 0; i<3 && i<this.roadMap.features.length; i++){
		step[i] = this.roadMap.features[this.stepNumber].geometry;
	}
	this.step = step;
	this.renderEngine.initialize();
	this.renderEngine.setCurrentStep(step);
	this.renderEngine.setGeolocation(this.position);
};

/**
 * apply Al-kashi theroem
 */
Monitor.prototype.calcAngle = function(A, B, C){
	var AB = this.calcDist(A, B);
	var AC = this.calcDist(A, C);
	var BC = this.calcDist(B, C);

	var tmp1 = Math.pow(AB, 2) + Math.pow(AC, 2) - Math.pow(BC, 2);
	var tmp2 = 2 * AB * AC;
	return Math.acos(tmp1/tmp2);
};

Monitor.prototype.calcDist = function(A, B){
	var squareAB = Math.pow(A[0]-B[0], 2) + Math.pow(A[1]-B[1], 2);
	return Math.sqrt(squareAB);
};


angular.module('app').service('Monitor', ['GeoHash', Monitor]);
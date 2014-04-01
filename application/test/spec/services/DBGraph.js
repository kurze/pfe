'use strict';

/* jshint undef: false, unused: false */

describe('Service: DBGraph', function () {

	// load the service's module
	beforeEach(function(){
		module('app');
	});

	it('localforage exist', function(){
		expect(localforage).toBeDefined();
	});

	// it('root QuadTree exist',  inject(function(DBGraph, $timeout) {
	// 	var valueToVerify='p';
	// 	// localforage.getItem('rootQuadTree', function(value){
	// 	// 	valueToVerify = value;
	// 	// });
	// 	localforage.getItem('rootQuadTree').then(function(value){
	// 		valueToVerify = value;
	// 	});
	// 	// $timeout.flush();
	// 	expect(valueToVerify).not().toBeNull();
	// }));
});
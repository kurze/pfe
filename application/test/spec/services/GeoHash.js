'use strict';

/* jshint undef: false, unused: false */

describe('Service: GeoHash', function () {

	// load the service's module
	beforeEach(function(){
		module('app');

		// instantiate service
		var GeoHash;

		inject(function (_GeoHash_) {
			GeoHash = _GeoHash_;
		});
		this.GeoHash = GeoHash;
	});

	it('GeoHash exist', function(){
		expect(this.GeoHash).toBeDefined();
	});
	
	it('encode & decode', function(){
		var coor = [10, 11];
		var hash = this.GeoHash.encode(coor);
		var decodeCoor = this.GeoHash.decode(hash);

		expect(decodeCoor[0]).toBeLessThan(coor[0]+decodeCoor[2]);
		expect(decodeCoor[1]).toBeGreaterThan(coor[1]-decodeCoor[3]);
	});

});

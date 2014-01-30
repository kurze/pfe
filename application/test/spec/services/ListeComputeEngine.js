'use strict';

describe('Service: ListeComputeEngine', function () {

	// load the service's module
	beforeEach(module('app'));

	// instantiate service
	var ListeCE;
	beforeEach(inject(function (_ListeComputeEngine_) {
		ListeCE = _ListeComputeEngine_;
	}));

	it('getItem() should return an array', function () {
		var items = ListeCE.getItem();
		expect(items).not.toBeNull();
		expect(typeof(items)).toEqual('object');
		expect(items.length).toBeGreaterThan(0);
		expect(items[0]).not.toBeNull();
	});

	it('getItem(0) should return a Compute Engine', function () {
		var item = ListeCE.getItem(0);
		expect(item).not.toBeNull();
		expect(typeof(item)).toEqual('object');
	});

	it('getItem(foo, bar) should throw an exception', function () {
		try {
			ListeCE.getItem(0, 'foo');
			expect(true).toEqual(false);
		} catch (e) {
			expect(e).toMatch(/bad number of parameters/);
		}
	});

});

'use strict';

describe('Service: ListeRenderEngine', function () {

	// load the service's module
	beforeEach(module('app'));

	// instantiate service
	var ListeRE;
	beforeEach(inject(function (_ListeRenderEngine_) {
		ListeRE = _ListeRenderEngine_;
	}));

	it('getItem() should return an array', function () {
		var items = ListeRE.getItem('video');
		expect(items).not.toBeNull();
		expect(typeof(items)).toEqual('object');
		expect(items.length).toBeGreaterThan(0);
		expect(items[0]).not.toBeNull();
	});

	it('getItem(0) should return a liste of Compute Engine', function () {
		var item = ListeRE.getItem('video', 0);
		expect(item).not.toBeNull();
		expect(typeof(item)).toEqual('object');
	});

	it('getItem(foo, bar) should throw an exception', function () {
		try {
			ListeRE.getItem('video', 0, 'foo');
			expect(true).toEqual(false);
		} catch (e) {
			expect(e).toMatch(/bad number of parameters/);
		}
	});

	it('"selected" should exist and should be null by default', function () {
		expect(ListeRE.selected).toBeDefined();
		expect(ListeRE.selected.video).toBeDefined();
		expect(typeof(ListeRE.selected.video)).toEqual('object');
	});


});

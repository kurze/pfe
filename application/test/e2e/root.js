'use strict';

describe('app', function() {

	describe('chooseComputeEngine', function() {

		beforeEach(function() {
			browser().navigateTo('/');
		});


		it('browser', function() {
			browser();
		});
		it('browser.location', function() {
			browser().location();
		});
		// it('browser.location.url', function() {
		// 	browser().location().url();
		// });

		// it('should automatically redirect to / when location hash/fragment is empty', function() {
		// 	expect(browser().location().url()).toBe("/#");
		// });

		// it('should automatically redirect to / when location hash/fragment is empty', function() {
		// 	element('.glyphicon-star').click();
		// 	expect(browser().location().url()).toBe("chooseComputeEngine");
		// });

	});

	describe('chooseComputeEngine', function() {

		beforeEach(function() {
			browser().navigateTo('#/chooseComputeEngine');
		});


		// it('should render chooseComputeEngine when user navigates to /chooseComputeEngine', function() {
		// 	expect(element('ng-view h1:first').text()).
		// 	toMatch(/Choose the compute Engine/);
		// });

	});

});
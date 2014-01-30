'use strict';

describe('Service: REHelloWorld', function () {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var REHelloWorld;
  beforeEach(inject(function (_REHelloWorld_) {
    REHelloWorld = _REHelloWorld_;
  }));

  it('should do something', function () {
    expect(!!REHelloWorld).toBe(true);
  });

});

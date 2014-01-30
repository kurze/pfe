'use strict';

describe('Service: ListeCE', function () {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var ListeCE;
  beforeEach(inject(function (_ListeCE_) {
    ListeCE = _ListeCE_;
  }));

  it('should do something', function () {
    expect(!!ListeCE).toBe(true);
  });

});

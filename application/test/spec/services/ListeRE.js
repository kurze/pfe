'use strict';

describe('Service: ListeRE', function () {

  // load the service's module
  beforeEach(module('app'));

  // instantiate service
  var ListeRE;
  beforeEach(inject(function (_ListeRE_) {
    ListeRE = _ListeRE_;
  }));

  it('should do something', function () {
    expect(!!ListeRE).toBe(true);
  });

});

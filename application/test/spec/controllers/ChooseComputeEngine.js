'use strict';

describe('Controller: ChooseComputeEngineCtrl', function () {

  // load the controller's module
  beforeEach(module('app'));

  var ChooseComputeEngineCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChooseComputeEngineCtrl = $controller('ChooseComputeEngineCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});

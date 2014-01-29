'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('app'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

describe('Controller: ChooseComputeEngineCtrl', function () {

  // load the controller's module
  beforeEach(module('app'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('ChooseComputeEngineCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.listComputeEngine.length).toBe(1);
  });

  it('ListeCE.selected should be null before change', function () {
    expect(scope.ListeCE.selected).toBe(null);
  });

  it('ListeCE.selected should be $scope.selected after change', function () {
    scope.selected = scope.listComputeEngine[0];
    scope.change();
    expect(scope.ListeCE.selected).toBe(scope.selected);
  });
});

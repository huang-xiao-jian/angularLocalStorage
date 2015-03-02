describe('storage module', function() {
  var $rootScope
    , $compile
    , storageOperate
    , storageUpdate;

  beforeEach(function () {
    module('storage');
  });

  beforeEach(function () {
    inject(function (_$rootScope_, _$compile_, _storageOperate_, _storageUpdate_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      storageOperate = _storageOperate_;
      storageUpdate = _storageUpdate_;
    })
  });

  it('should exposed operation service', function () {
    expect(storageOperate).toBeDefined();
  });

  it('should exposed update service', function () {
    expect(storageUpdate).toBeDefined();
  });

  it('should exposed data-bind directive', function () {
    $scope = $rootScope.$new();
    element = $compile('<input type="text" ng-model="sky" storage-bind="sky" storage-bind-direction="reverse" >')($scope);
    storageOperate.set('sky', 'blue');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('blue');
    $scope.sky = 'rain';
    expect(storageOperate.get('sky')).toEqual('blue');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('rain');
  });

  afterEach(function () {

  });
});
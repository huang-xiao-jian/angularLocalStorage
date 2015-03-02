describe("storage.through module", function() {
  var $rootScope
    , $scope
    , $compile
    , $sniffer
    , storageOperate
    , element;

  beforeEach(function () {
    module('storage.through');
  });

  beforeEach(function () {
    inject(function (_$rootScope_, _$compile_, _$sniffer_, _storageOperate_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $compile = _$compile_;
      $sniffer = _$sniffer_;
      storageOperate = _storageOperate_;
    })
  });

  it('initialize should work right', function () {
    storageOperate.set('sky', 'blue');
    element = $compile('<input type="text" ng-model="sky" storage-bind="sky" storage-bind-direction="reverse" >')($scope);
    $scope.$digest();
    expect($scope.sky).toEqual('blue');
    expect(storageOperate.get('sky')).toEqual('blue');
    $scope.sky = 'rain';
    $scope.$digest();
    expect($scope.sky).toEqual('rain');
    expect(storageOperate.get('sky')).toEqual('rain');
  });

  it('reverse direction should work right', function () {
    element = $compile('<input type="text" ng-model="sky" storage-bind="sky" storage-bind-direction="reverse" >')($scope);
    storageOperate.set('sky', 'blue');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('blue');
    $scope.sky = 'rain';
    expect(storageOperate.get('sky')).toEqual('blue');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('rain');
  });

  it('forward direction should work right', function () {
    element = $compile('<input type="text" ng-model="sky" storage-bind="sky" storage-bind-direction="forward" >')($scope);
    storageOperate.set('sky', 'blue');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('blue');
    element.val('colorful');
    element.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('colorful');
  });

  it('normal direction should work right', function () {
    element = $compile('<input type="text" ng-model="sky" storage-bind="sky" storage-bind-direction="normal" >')($scope);
    storageOperate.set('sky', 'blue');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('blue');
    element.val('colorful');
    element.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('colorful');
    $scope.sky = 'rain';
    expect(storageOperate.get('sky')).toEqual('colorful');
    $scope.$digest();
    expect(storageOperate.get('sky')).toEqual('rain');
  });

  afterEach(function () {
    storageOperate.clear();
  });
});
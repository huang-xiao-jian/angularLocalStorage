describe("just check storage service date-bind API", function() {
    var $rootScope;
    var $scope;
    var storage;

    beforeEach(function () {
        module('storage');
    });

    beforeEach(function () {
        inject(function (_$rootScope_, _storage_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            storage = _storage_;
        })
    });

    it('forward data-bind should work right', function () {
        $scope.modelKey = 123;
        storage.set('storageKey', 'love');
        storage.bind($scope, 'modelKey', 'storageKey', 'forward');
        $scope.modelKey = 125;
        $scope.$digest();
        var getValue = storage.get('storageKey');
        expect(getValue).toEqual(125);
    });

    it('forward data-bind cancel should work right', function () {
        var getValue;
        $scope.modelKey = 123;
        storage.set('storageKey', 'love');
        storage.bind($scope, 'modelKey', 'storageKey', 'forward');
        $scope.modelKey = 125;
        $scope.$digest();
        getValue = storage.get('storageKey');
        expect(getValue).toEqual(125);
        storage.unbind($scope, 'modelKey', 'storageKey', 'forward');
        $scope.modelKey = 127;
        $scope.$digest();
        getValue = storage.get('storageKey');
        expect(getValue).toEqual(125);
    });

    it('reverse data-bind should work right', function () {
        storage.set('storageKey', 123);
        $scope.modelKey = 'love';
        storage.bind($scope, 'modelKey', 'storageKey', 'reverse');
        storage.set('storageKey', 125);
        $scope.$digest();
        var getValue = $scope.modelKey;
        expect(getValue).toEqual(125);
    });

    it('reverse data-bind cancel should work right', function () {
        var getValue;
        storage.set('storageKey', 123);
        $scope.modelKey = 'love';
        storage.bind($scope, 'modelKey', 'storageKey', 'reverse');
        storage.set('storageKey', 125);
        $scope.$digest();
        getValue = $scope.modelKey;
        expect(getValue).toEqual(125);
        storage.unbind($scope, 'modelKey', 'storageKey', 'reverse');
        storage.set('storageKey', 127);
        $scope.$digest();
        getValue = $scope.modelKey;
        expect(getValue).toEqual(125);
    });

    it('normal data-bind should work right', function () {
        var getValue;
        $scope.modelKey = 123;
        storage.set('storageKey', 'love');
        storage.bind($scope, 'modelKey', 'storageKey', 'normal');
        $scope.modelKey = 125;
        $scope.$digest();
        getValue = storage.get('storageKey');
        expect(getValue).toEqual(125);
        storage.set('storageKey', 123);
        $scope.$digest();
        getValue = $scope.modelKey;
        expect(getValue).toEqual(123);
    });

    it('forward data-bind cancel should work right', function () {
        var getValue;
        $scope.modelKey = 123;
        storage.set('storageKey', 'love');
        storage.bind($scope, 'modelKey', 'storageKey', 'normal');
        $scope.modelKey = 125;
        $scope.$digest();
        getValue = storage.get('storageKey');
        expect(getValue).toEqual(125);
        storage.set('storageKey', 123);
        $scope.$digest();
        getValue = $scope.modelKey;
        expect(getValue).toEqual(123);

        storage.unbind($scope, 'modelKey', 'storageKey', 'normal');
        $scope.modelKey = 127;
        $scope.$digest();
        getValue = storage.get('storageKey');
        expect(getValue).toEqual(123);

        storage.set('storageKey', 129);
        $scope.$digest();
        getValue = $scope.modelKey;
        expect(getValue).toEqual(127);
    });

    afterEach(function () {
        storage.clear();
        $scope = null;
        storage = null;
    });
});
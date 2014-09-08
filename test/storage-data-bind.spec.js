describe("just check storage service basic API", function() {
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
        storage.bind($scope, 'modelKey', 'storageKey', 'forward');
        $scope.modelKey = 125;
        $scope.$digest();
        var getValue = storage.get('storageKey');
        var compare = angular.equals(getValue, 125);
        expect(compare).toBeTruthy();
    });

    xit('forward data-bind cancel should work right', function () {
        $scope.modelKey = 123;
        storage.bind($scope, 'modelKey', 'storageKey', 'forward');
        storage.unbind($scope, 'modelKey', 'storageKey', 'forward');
        $scope.modelKey = 125;
        $scope.$digest();
        var getValue = storage.get('storageKey');
        expect(getValue).toEqual(123);
    });

    it('reverse data-bind should work right', function () {
        storage.set('storageKey', 123);
        storage.bind($scope, 'modelKey', 'storageKey', 'reverse');
        storage.set('storageKey', 125);
        $scope.$digest();
        var getValue = $scope.modelKey;
        var compare = angular.equals(getValue, 125);
        expect(compare).toBeTruthy();
    });

    xit('reverse data-bind calcel should work right', function () {
        storage.set('storageKey', 123);
        storage.bind($scope, 'modelKey', 'storageKey', 'reverse');
        storage.unbind($scope, 'modelKey', 'storageKey', 'reverse');
        storage.set('storageKey', 125);
        $scope.$digest();
        var getValue = $scope.modelKey;
        var compare = angular.equals(getValue, 125);
        expect(compare).toBeTruthy();
    });

    afterEach(function () {
        storage.clear();
        $scope = null;
        storage = null;
    });
});
describe("just check storage service variable type support", function() {
    var storage;

    beforeEach(function(){
        module('storage');
    });

    beforeEach(function () {
        inject(function (_storage_) {
            storage = _storage_;
        })
    });

    it('just check number support', function () {
        storage.set('love', 123.45);
        var getValue = storage.get('love');
        var compare = angular.equals(getValue, 123.45);
        expect(compare).toBeTruthy();
    });

    it('just check string support', function () {
        storage.set('love', 'edge of tomorrow');
        var getValue = storage.get('love');
        var compare = angular.equals(getValue, 'edge of tomorrow');
        expect(compare).toBeTruthy();
    });

    it('just check array support', function () {
        storage.set('love', ['one','two','three']);
        var getValue = storage.get('love');
        var compare = angular.equals(getValue, ['one','two','three']);
        expect(compare).toBeTruthy();
    });

    it('just check object support', function () {
        storage.set('love', {"first" : 123});
        var getValue = storage.get('love');
        var compare = angular.equals(getValue, {"first" : 123});
        expect(compare).toBeTruthy();
    });

    it('just check boolean true support', function () {
        storage.set('love', true);
        var getValue = storage.get('love');
        var compare = angular.equals(getValue, true);
        expect(compare).toBeTruthy();
    });

    it('just check boolean false support', function () {
        storage.set('love', false);
        var getValue = storage.get('love');
        var compare = angular.equals(getValue, false);
        expect(compare).toBeTruthy();
    });

    it('just check null support', function () {
        storage.set('love', null);
        var getValue = storage.get('love');
        expect(getValue).toBeNull();
    });

    it('just check undefined support', function () {
        storage.set('love', undefined);
        var getValue = storage.get('love');
        expect(getValue).toBeUndefined();
    });

    it('just check date support', function () {
        var date = new Date();
        storage.set('love', date);
        var getValue = storage.get('love');
        var compare = angular.isDate(getValue);
        expect(compare).toBeTruthy();
    });

    it('just check regexp support', function () {
        var regexp = new RegExp('^love', 'gi');
        storage.set('love', regexp);
        var getValue = storage.get('love');
        expect(getValue.test('love story')).toBeTruthy();
    });

    it('just check repeated set not throw error', function () {
        var repeated = function() {
            storage.set('love', true);
            storage.set('love', 'the last of US');
        };
        expect(repeated).not.toThrow();
    });
});

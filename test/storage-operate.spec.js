describe("just check storage service basic API", function() {
    var storage;
    var string = "love story";
    var compare =  "forever lifetime";

    beforeEach(function () {
        module('storage');
    });

    beforeEach(function () {
        inject(function (_storage_) {
            storage = _storage_;
        })
    });

    it('Storage set/get should cooperate well', function () {
        storage.set('love', string);
        var getValue = storage.get('love');
        var compare = angular.equals(getValue, string);
        expect(compare).toBeTruthy();
    });

    it('Storage remove method should work right', function () {
        storage.set('love', string);
        storage.remove("love");
        expect(storage.get("love")).toBeNull();
    });

    it('Storage clear method should work right', function () {
        storage.set('love', string);
        storage.set('content', compare);
        storage.clear();
        expect(storage.get('love')).toBeNull();
        expect(storage.get('content')).toBeNull();
    });
});

describe("just check storage service higher API", function() {
    var storage;

    beforeEach(function () {
        module('storage');
    });

    beforeEach(function () {
        inject(function (_storage_) {
            storage = _storage_;
        })
    });

    it('$inc modifier should work right', function () {
        storage.set('love',1942);
        storage.update('$inc', 'love', 3);
        expect(storage.get('love')).toEqual(1945);
        storage.update('$inc', 'love', -3);
        expect(storage.get('love')).toEqual(1942);
    });

    it('$verse modifier should work right', function () {
        storage.set('love', true);
        storage.update('$verse', 'love');
        expect(storage.get('love')).toBeFalsy();
        storage.update('$verse', 'love');
        expect(storage.get('love')).toBeTruthy();
    });

    it('$extend modifier should work right', function () {
        var compare = {
            name: 'julia',
            age: 23
        };
        storage.set('love',compare);
        storage.update('$extend', 'love', {'name': 'jason', 'sex': 'male'});
        expect(storage.get('love').name).toEqual('jason');
        expect(storage.get('love').age).toEqual(23);
        expect(storage.get('love').sex).toEqual('male');
    });

    it('$push modifier should work right', function () {
        storage.set('love', []);
        storage.update('$push', 'love', 'melon');
        expect(storage.get('love')).toEqual(['melon']);
    });

    it('$addToSet modifier should work right', function () {
        storage.set('love', ['love', 'melon']);
        storage.update('$addToSet', 'love', 'melon');
        expect(storage.get('love')).toEqual(['love', 'melon']);
    });

    it('$pull modifier should work right', function () {
        storage.set('love', ['story', 'melon', 'story']);
        storage.update('$pull', 'love', 'story');
        expect(storage.get('love')).toEqual(['melon']);
    });

    it('$unique modifier should work right', function () {
        var mock_array = ["apple", "banana", "apple", "banana"];
        storage.set("love", mock_array);
        storage.update("$unique", "love");
        expect(storage.get("love")).toEqual(["apple", "banana"]);
    });
});
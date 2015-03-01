
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

  it('$inc modifier should do nothing with wrong parameter', function () {
    storage.set('love',1942);
    storage.update('$inc', 'love', 'year');
    expect(storage.get('love')).toEqual(1942);
    storage.set('love','1942');
    storage.update('$inc', 'love', -3);
    expect(storage.get('love')).toEqual('1942');
  });

  it('$verse modifier should work right', function () {
    storage.set('love', true);
    storage.update('$verse', 'love');
    expect(storage.get('love')).toBeFalsy();
    storage.update('$verse', 'love');
    expect(storage.get('love')).toBeTruthy();
  });

  it('$verse modifier should do nothing when wrong parameter', function () {
    storage.set('love', 'summer');
    storage.update('$verse', 'love');
    expect(storage.get('love')).toEqual('summer');
  });

  it('$push modifier should work right', function () {
    storage.set('love', []);
    storage.update('$push', 'love', 'melon');
    expect(storage.get('love')).toEqual(['melon']);
  });

  it('$push modifier should do nothing when wrong parameter', function () {
    storage.set('love', 'forever');
    storage.update('$push', 'love', 'melon');
    expect(storage.get('love')).toEqual('forever');
  });

  it('$addToSet modifier should work right with existed value', function () {
    storage.set('love', ['love', 'melon']);
    storage.update('$addToSet', 'love', 'melon');
    expect(storage.get('love')).toEqual(['love', 'melon']);
  });

  it('$addToSet modifier should work right with new value', function () {
    storage.set('love', ['love', 'melon']);
    storage.update('$addToSet', 'love', 'summer');
    expect(storage.get('love')).toEqual(['love', 'melon', 'summer']);
  });

  it('$addToSet modifier should do nothing when wrong parameter', function () {
    storage.set('love', ['love', 'melon']);
    storage.update('$addToSet', 'love', ['melon', 'karma', 'apple']);
    expect(storage.get('love')).toEqual(['love', 'melon']);
  });

  it('$addToSet modifier should do nothing when wrong parameter', function () {
    storage.set('love', 'summer');
    storage.update('$addToSet', 'love', ['melon']);
    expect(storage.get('love')).toEqual('summer');
  });

  it('$pull modifier should work right', function () {
    storage.set('love', ['story', 'melon', 'story']);
    storage.update('$pull', 'love', 'story');
    expect(storage.get('love')).toEqual(['melon']);
  });

  it('$pull modifier should do nothing when wrong parameter', function () {
    storage.set('love', 'story');
    storage.update('$pull', 'love', 'story');
    expect(storage.get('love')).toEqual('story');
  });

  it('$unique modifier should work right', function () {
    var mock_array = ["apple", "banana", "apple", "banana"];
    storage.set("love", mock_array);
    storage.update("$unique", "love");
    expect(storage.get("love")).toEqual(["apple", "banana"]);
  });

  it('$unique modifier should do nothing when wrong parameter', function () {
    var mock_array = "apple";
    storage.set("love", mock_array);
    storage.update("$unique", "love");
    expect(storage.get("love")).toEqual('apple');
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

  it('$extend modifier should do nothing when wrong parameter', function () {
    var compare = {
      name: 'julia',
      age: 23
    };
    storage.set('love',compare);
    storage.update('$extend', 'love', 'summer');
    expect(storage.get('love').name).toEqual('julia');
    expect(storage.get('love').age).toEqual(23);
  });

  it('$extend modifier should do nothing when wrong parameter', function () {
    var compare = 'julia';
    storage.set('love',compare);
    storage.update('$extend', 'love', {age: 23});
    expect(storage.get('love')).toEqual('julia');
  });

  it('$extend modifier should do nothing when wrong parameter', function () {
    var compare = 'julia';
    storage.set('love',compare);
    storage.update('$extend', 'love', 'summer');
    expect(storage.get('love')).toEqual('julia');
  });

});
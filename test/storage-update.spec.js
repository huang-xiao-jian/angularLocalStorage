describe("storage.update module", function() {
  var storageUpdate, storageOperate;

  beforeEach(function () {
    module('storage.update');
  });

  beforeEach(function () {
    inject(function (_storageUpdate_, _storageOperate_) {
      storageUpdate = _storageUpdate_;
      storageOperate = _storageOperate_;
    })
  });

  it('$inc modifier should work right', function () {
    storageOperate.set('love',1942);
    storageUpdate.$inc('love', 3);
    expect(storageOperate.get('love')).toEqual(1945);
    storageUpdate.$inc('love', -3);
    expect(storageOperate.get('love')).toEqual(1942);
  });

  it('$inc modifier should do nothing with wrong parameter', function () {
    storageOperate.set('love',1942);
    storageUpdate.$inc('love', 'year');
    expect(storageOperate.get('love')).toEqual(1942);
  });

  it('$verse modifier should work right', function () {
    storageOperate.set('love', true);
    storageUpdate.$verse('love');
    expect(storageOperate.get('love')).toBeFalsy();
    storageUpdate.$verse('love');
    expect(storageOperate.get('love')).toBeTruthy();
  });

  it('$verse modifier should do nothing when wrong parameter', function () {
    storageOperate.set('love', 'summer');
    storageUpdate.$verse('love');
    expect(storageOperate.get('love')).toEqual('summer');
  });

  it('$push modifier should work right', function () {
    storageOperate.set('love', []);
    storageUpdate.$push('love', 'melon');
    expect(storageOperate.get('love')).toEqual(['melon']);
  });

  it('$push modifier should do nothing when wrong parameter', function () {
    storageOperate.set('love', 'forever');
    storageUpdate.$push('love', 'melon');
    expect(storageOperate.get('love')).toEqual('forever');
  });

  it('$addToSet modifier should work right with existed value', function () {
    storageOperate.set('love', ['banana', 'melon']);
    storageUpdate.$addToSet('love', 'melon');
    expect(storageOperate.get('love')).toEqual(['banana', 'melon']);
  });

  it('$addToSet modifier should work right with new value', function () {
    storageOperate.set('love', ['banana', 'melon']);
    storageUpdate.$addToSet('love', 'summer');
    expect(storageOperate.get('love')).toEqual(['banana', 'melon', 'summer']);
  });

  it('$addToSet modifier should do nothing when wrong parameter', function () {
    storageOperate.set('love', 'banana');
    storageUpdate.$addToSet('love', 'apple');
    expect(storageOperate.get('love')).toEqual('banana');
  });

  it('$unique modifier should work right', function () {
    storageOperate.set("love", ["apple", "banana", "apple", "banana"]);
    storageUpdate.$unique("love");
    expect(storageOperate.get("love")).toEqual(["apple", "banana"]);
  });

  it('$unique modifier should do nothing when wrong parameter', function () {
    storageOperate.set("love", "banana");
    storageUpdate.$unique("love");
    expect(storageOperate.get("love")).toEqual('banana');
  });

  it('$extend modifier should work right', function () {
    storageOperate.set('love', {
      'title': 'karma unit test',
      'content': 'protractor E2E test'
    });
    storageUpdate.$extend('love', {
      'title': 'selenium driven',
      'page': 45
    });
    expect(storageOperate.get('love')).toEqual(jasmine.any(Object));
    expect(storageOperate.get('love').title).toEqual('selenium driven');
    expect(storageOperate.get('love').page).toEqual(45);
  });

  it('$pull modifier should work right', function () {
    storageOperate.set('love', ['banana', 'melon', 'story']);
    storageUpdate.$pull('love', 'story');
    expect(storageOperate.get('love')).toEqual(['banana', 'melon']);
  });

  it('$pull modifier should do nothing when wrong parameter', function () {
    storageOperate.set('love', 'story');
    storageUpdate.$pull('love', 'webkit');
    expect(storageOperate.get('love')).toEqual('story');
  });



  it('$extend modifier should work right', function () {
    var compare = {
      name: 'julia',
      age: 23
    };
    storageOperate.set('love',compare);
    storageUpdate.$extend('love', {'name': 'jason', 'sex': 'male'});
    expect(storageOperate.get('love').name).toEqual('jason');
    expect(storageOperate.get('love').age).toEqual(23);
    expect(storageOperate.get('love').sex).toEqual('male');
  });

  it('$extend modifier should do nothing when wrong parameter', function () {
    var compare = {
      name: 'julia',
      age: 23
    };
    storageOperate.set('love',compare);
    storageUpdate.$extend('love', 'summer');
    expect(storageOperate.get('love').name).toEqual('julia');
    expect(storageOperate.get('love').age).toEqual(23);
  });

  it('$extend modifier should do nothing when wrong parameter', function () {
    storageOperate.set('love', 'julia');
    storageUpdate.$extend('love', {age: 23});
    expect(storageOperate.get('love')).toEqual('julia');
  });
});
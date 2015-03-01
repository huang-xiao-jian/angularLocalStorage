describe('just check storage service basic API', function() {
  var storage;

  beforeEach(function () {
    module('storage');
  });

  beforeEach(function () {
    inject(function (_storage_) {
        storage = _storage_;
    });
  });

  it('Storage set/get should cooperate well', function () {
    storage.set('story', 'love is color blind');
    expect(storage.get('story')).toEqual('love is color blind');
  });

  it('Storage remove method should work right', function () {
    storage.set('story', 'love is color blind');
    storage.remove("love");
    expect(storage.get("love")).toBeNull();
  });

  it('Storage clear method should work right', function () {
    storage.set('story', 'love is color blind');
    storage.set('content', 'forever girl');
    storage.clear();
    expect(storage.get('love')).toBeNull();
    expect(storage.get('content')).toBeNull();
  });

  it('Storage getSize method should work right', function () {
    storage.set('story', 'love is color blind');
    storage.set('content', 'forever girl');
    expect(storage.getSize()).toEqual(2);
    storage.clear();
  });

  it('Storage getByIndex method should work right', function () {
    storage.set('story', 'love is color blind');
    storage.set('content', 'forever girl');
    expect(storage.getByIndex(0)).toEqual('forever girl');
    expect(storage.getByIndex(1)).toEqual('love is color blind');
    storage.clear();
  });
});

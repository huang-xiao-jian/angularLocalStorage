describe('storage.operate module', function() {
  var storageOperate;

  beforeEach(function () {
    module('storage.operate');
  });

  beforeEach(function () {
    inject(function (_storageOperate_) {
      storageOperate = _storageOperate_;
    });
  });

  it('Storage set/get should cooperate well', function () {
    storageOperate.set('story', 'love is color blind');
    expect(storageOperate.get('story')).toEqual('love is color blind');
  });

  it('Storage remove method should work right', function () {
    storageOperate.set('story', 'love is color blind');
    storageOperate.remove("love");
    expect(storageOperate.get("love")).toBeNull();
  });

  it('Storage clear method should work right', function () {
    storageOperate.set('story', 'love is color blind');
    storageOperate.set('content', 'forever girl');
    storageOperate.clear();
    expect(storageOperate.get('love')).toBeNull();
    expect(storageOperate.get('content')).toBeNull();
  });

  it('Storage getSize method should work right', function () {
    storageOperate.set('story', 'love is color blind');
    storageOperate.set('content', 'forever girl');
    expect(storageOperate.getSize()).toEqual(2);
    storageOperate.clear();
  });

  it('Storage getByIndex method should work right', function () {
    storageOperate.set('content', 'forever girl');
    expect(storageOperate.getByIndex(0)).toEqual('forever girl');
    storageOperate.clear();
  });
});

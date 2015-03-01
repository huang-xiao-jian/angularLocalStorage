xdescribe("just check storage.utils module normal function", function() {
  var utils;

  beforeEach(function(){
    module('storage.utils');
  });

  beforeEach(function () {
    inject(function (_storageUtils_) {
      utils = _storageUtils_;
    })
  });

  it('just check undefined support', function () {
    expect(utils.parseValue(utils.resolveValue(undefined))).toBeNull();
  });

  it('just check null support', function () {
    expect(utils.parseValue(utils.resolveValue(null))).toBeNull();
  });

  it('just check boolean support', function () {
    expect(utils.parseValue(utils.resolveValue(true))).toBeTruthy();
    expect(utils.parseValue(utils.resolveValue(false))).toBeFalsy();
  });

  it('just check number support', function () {
    expect(utils.parseValue(utils.resolveValue(1))).toEqual(1);
  });

  it('just check string support', function () {
    expect(utils.parseValue(utils.resolveValue('storage'))).toEqual('storage');
  });

  it('just check object support', function () {
    var result = utils.parseValue(utils.resolveValue({"title":"love is colorful"}));
    expect(result).toEqual(jasmine.any(Object));
    expect(result.title).toEqual("love is colorful");
  });

  it('just check array support', function () {
    var result = utils.parseValue(utils.resolveValue(['one','two','three']));
    expect(result).toEqual(jasmine.any(Array));
    expect(result[0]).toEqual('one');
  });

  it('just check date support', function () {
    var date = new Date();
    var result = utils.parseValue(utils.resolveValue(date));
    expect(result).toEqual(jasmine.any(Date));
    expect(date.getTime()).toEqual(result.getTime());
  });

  it('just check regexp support', function () {
    var regexp = /^love/g;
    var result = utils.parseValue(utils.resolveValue(regexp));
    expect(regexp.test('love is colorful')).toBeTruthy();
    expect(result).toEqual(jasmine.any(RegExp));
    expect(result.test('love is colorful')).toBeTruthy();
  });

  it('just check inArray function', function () {
    var source = ["one", "two", "three"];
    expect(utils.inArray(source, "one")).toBeTruthy();
    expect(utils.inArray(source, "fifth")).toBeFalsy();
  });

  it('just check uniqueArray function', function () {
    var source = ["one", "two", "one", "three", "two"];
    expect(utils.uniqueArray(source)).toEqual(["one", "two", "three"]);
  });
});

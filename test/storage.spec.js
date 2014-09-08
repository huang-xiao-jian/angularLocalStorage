/**
 * Created by Administrator on 14-2-27.
'toBe' 
'toEqual()' 
'toMatch()' 
'toBeDefined()' 
`toBeUndefined()` 
'toBeNull()' 
'toBeTruthy()' 
'toBeFalsy()'
'toContain()' 
'toBeLessThan()'
'toBeGreaterThan()' 
'toBeCloseTo()'
'toThrow()'
jasmine.any()
jasmine.objectContaining()
 */
describe("The storage service", function() {
    var scope,storage;
    beforeEach(function(){
        module('administratorApp')
    });

    beforeEach(function () {
        inject(function ($injector) {
            storage = $injector.get('storage')
        })
    });

    xit('the service should inject right',function(){
       expect(storage).toBeDefined();
    });

    xit('the set/get method pair should resolve multi variable type',function(){
       var a = 123,b = 'lovestory',c = ['one','two','three'], d = {"first" : 123},e;

       storage.set('love',a);
       expect(storage.get('love')).toBe(a);

       storage.set('love',b);
       expect(storage.get('love')).toBe(b);

       storage.set('love',c);
       expect(storage.get('love')).toEqual(jasmine.any(Array));
       expect(storage.get('love').length).toEqual(3);

       storage.set('love',d);
       expect(storage.get('love')).toEqual(jasmine.any(Object));
       expect(storage.get('love').first).toEqual(123);

       storage.set('love',true);
       expect(storage.get('love')).toBeTruthy();

       storage.set('love',false);
       expect(storage.get('love')).toBeFalsy();

       storage.set('love',e);
       expect(storage.get('love')).toBeUndefined();    

       storage.set('love',null);
       expect(storage.get('love')).toBeNull();           
    })

    xit('the remove/clear method pari should delete key/value',function(){
        var tmp = 'lovestory';

        storage.set('love',tmp);
        storage.remove('love');
        expect(storage.get('love')).toBeNull();

        storage.set('love',tmp);
        storage.clear('love');
        expect(storage.get('love')).toBeNull();
    })

    xit('the $inc should increse the number(negative accept),ignore other variable types',function(){
        var a = 123, b = a.toString();
        storage.set('love',a);
        storage.update('love','$inc',1);
        expect(storage.get('love')).toBe(124);
        storage.update('love','$inc',-1);
        expect(storage.get('love')).toBe(123);

        storage.set('love',b);
        storage.update('love','$inc',1);
        expect(storage.get('love')).toBe(b);

    });

    xit('the $unique should unique the Array only',function(){
        var a = ['first','first','first','first'];
        storage.set('love',a);
        storage.update('love','$unique');
        expect(storage.get('love')).toEqual(new Array('first'));
    });

    xit('the $push should add new value(Array included) into Array only',function(){
        var a = ['first'];
        var b = ['second','third'];
        storage.set('love',a);
        storage.update('love','$push',b);
        expect(storage.get('love')).toEqual(a.concat(b));
    });

    xit('the $combine should merge object and newValue will override if has the same key',function(){
        var a = {"first" : "love"};
        var b = {"second" : "story"};
        var c = {"first" : "heaven"};
        storage.set('love',a);
        storage.update('love','$combine',b);
        expect(storage.get('love').first).toBe(a.first);
        expect(storage.get('love').second).toBe(b.second);
        storage.update('love','$combine',c);
        expect(storage.get('love').first).toBe(c.first);
    });

    xit('the $addToSet should add new value(Array included) into Array only,ignore existed value',function(){
        var a = ['first'];
        var b = ['first','first'];
        storage.set('love',a);
        storage.update('love','$addToSet','first');
        expect(storage.get('love')).toEqual(a);

        storage.set('love',a);
        storage.update('love','$addToSet',b);
        expect(storage.get('love')).toEqual(a);
    });    

    xit('if angular is acceptable',function(){
        expect(angular).toBeDefined();
    });

});

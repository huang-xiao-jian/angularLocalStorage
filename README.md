angularLocalStorage 
====================
![Build Status](https://img.shields.io/travis/bornkiller/angularLocalStorage/master.svg?style=flat)
![Coverage Report](http://img.shields.io/coveralls/bornkiller/angularLocalStorage.svg?style=flat)
![Package Dependency](https://david-dm.org/bornkiller/angularLocalStorage.svg?style=flat)
![Package DevDependency](https://david-dm.org/bornkiller/angularLocalStorage/dev-status.svg?style=flat)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/huangjian-storage.svg)](https://saucelabs.com/u/huangjian-storage)

The simplest localStorage module you will ever use. Allowing you to set, get, and *bind* variables.

##Install

```shell
bower install angular-localstorage-modern --save
```

```html
<script src="bower_components/dist/storage.js></script>
```

## Warning
Break change after v0.8.0,  original `storage` service split into `storageUtils`, `storageOperate`,  `storageUpdate` service, and use directive `storage-bind` to achieve data-binding.
 
## Attention 

* You can directly store Objects, Arrays, Floats, Booleans, and Strings. No need to convert your javascript values from strings. Till now, I add RegExps, Datessupport.
* No Fallback to Angular ``$cookies`` if localStorage is not supported
* TDD rule to code this module.
* You can also see <https://github.com/agrublev/angularLocalStorage>

## How to use

1. Just add this module to your app as a dependency
   ```javascript
   var app = angular.module('app', ['storage']
   ```

2. Now inside your controllers simply pass the storage factory like this
   ```javascript
    app.controller('Controller', ['$scope','storageOperate', 'storageUpdate',
      function($scope, storageOperate,storageUpdate){
        $scope.title = 'angularLocalStorage';    
      }
    ])
    ```

3. Using the ``storageOperate`` service.
  ```javascript
    // just storing something in localStorage
    storageOperate.set('key','value');
  
    // getting that value
    storageOperate.get('key');

    // getting that value through index
    storageOperate.getByIndex(1);

    // remove that key
    storageOperate.remove('key');

    // clear all localStorage values
    storageOperate.clear();

    // get localStorage length
    storageOperate.getSize();
  ```

4. Using the `storageUpdate` service.

    | method             | feature        |
    | :------------------: | :-------------   |
    | $inc             | plus a number for the stored value(negative acceptable) |
    | $verse        | verse Booleans value |
    | $push          | push new value into the stored array |
    | $addToset | push new value into the stored array, and ensure it's unique |
    | $pull            | remove specific item in an array |
    | $unique      | unique the stored array |
    | $extend       | extend stored object with pass-in object |

  For example: 

  ```javascript
  storageOperate.set('love', 1);
  storageUpdate.$inc('love', 5);
  storageOperate.get('love') == 6;
  ```
  ```javascript
  storageOperate.set('love', ['first', 'second']);
  storageUpdate.$push('love', 'third');
  storageOperate.get('love') == ['first', 'second', 'third']
  ```

5. About data-binding.
 ```html
  <input type="text" ng-model="sky" storage-bind="sky" storage-bind-direction="reverse" >
  ```
Directive `storage-bind`, use `storage-bind-direction` config the direction, require `ng-model` directive. 

    | direction           | instruction |
    | :------------------: | :-------------|
    | forward            | sync through model -->  localstorage --> view |
    | reverse            | sync through view --> localstorage --> model |
    | normal             | sync both way                  |

Compare with agrublev , I had modified all the code about data-binding for more simple use.  And remember that, when localstorage value changes, it doesn't change the model or view value since v0.8.0, because I think this meaningless.

## Feature coming soon
 New update modify comes later,forget the get -> operate -> set order.
  
 Please add an issue with ideas, improvements, or bugs! Thanks!
 You can send me email ``hjj491229492@hotmail.com``

---

(c) 2013 MIT License
angularLocalStorage [![Build Status](https://travis-ci.org/agrublev/angularLocalStorage.png?branch=master)](https://travis-ci.org/agrublev/angularLocalStorage)
====================

The simpliest localStorage module you will ever use. Allowing you to set, get, and *bind* variables.

## Attention
For some reason, I am working on rebuilding this service. if you need immediately, useful javascript file right now, checkout old-version branch.


##Install

	bower install https://github.com/bornkiller/angularLocalStorage.git
   
```html
<script src="scripts/service/localstorage.js></script>
```

## Attention :

* You can directly store Objects, Arrays, Floats, Booleans, and Strings. No need to convert your javascript values from strings.
* No Fallback to Angular ``$cookies`` if localStorage is not supported
* I follow the TDD rule to code this module , basic function works right, except the data binding, since I think it meaningless.
* You can also see <https://github.com/agrublev/angularLocalStorage>


## How to use

1. Just add this module to your app as a dependency
``var yourApp = angular.module('yourApp', [..., 'angularLocalStorage']``
2. Now inside your controllers simply pass the storage factory like this
``yourApp.controller('yourController', function( $scope, storage){``
3. Using the ``storage`` factory
  ```JAVASCRIPT

  // just storing something in localStorage
  storage.set('key','value');
  
  // getting that value
  storage.get('key');

  // remove that key
  storage.remove('key');

  // clear all localStorage values
  storage.clear();
  
  // just update stored things in localStorage
  storage.update('storageKey','modifier','value');

  //make a data-binding from model to localstorage or reverse or both 
  storage.bind($scope,'modelKey','storageKey','dirction');
  
   //cancel  data-binding from model to localstorage or reverse or both 
  storage.unbind($scope,'modelKey','storageKey','dirction');
  ```
4. About  update method
   ``update(storageKey,modify,value)``

  | modify                | feature        |
  | :------------------: | :------------- |
  | ``$inc``               |  to plus a number for the stored value(negative acceptable)     |
  | ``$push``            |  to push new value into the stored array(array and other   variable type acceptalbe)
  | ``$addToset``    |  to push a new value that doesn't exist in the stored array (array and other variable type acceptalbe)|
  | ``$unique``         |  unique the stored array,the third argument not in need |
  | ``$combine``      |  to update the stored object by the value,when key conflict happens,passing-in value will override |

  For example 
  ```javascript
      storage.set('love',1);
      storage.update('$inc','love',5);
      storage.get('love') == 6;
  ```
  ```javascript
      storage.set('love',['first','second']);
      storage.update('$push','love','third');
      storage.get('love') == ['first','second','third']
  ```

  ```javascript
      storage.set('love',['first','first','first']);
      storage.update('$unique','love');
      storage.get('love') == ['first']
  ```
  ```javascript
      storage.set('love',{"title":"I love you","content":"I wish you were here"});
      storage.update('$combine','love',{"content":"Rock N roll","label":"dark"});
      storage.get('love') == {
             "title":"I love you",
             "content":"Rock N roll",
             "label":"dark" 
     }
  ```

5. About data-binding 
  Compare with agrublev , I had modified all the code about data-binding for more simple use. 
  Below is example snippt for data-binding if you don't use bind method:
  ```JAVASCRIPT
      $scope.storageListener = function(){
          return storage.get('zero');
      }
      var tmp=$scope.$watch($scope.storageListener,function(newVal,oldVal){
      	  $scope.zero = newVal;
      },true) 
      tmp(); 
  ```
  The snippt purpose is to modify $scope.zero when localstorage.zero has changed,direction is from localstorage to
  model

  ```JAVASCRIPT
      $scope.zero = 'I Love You!';
      var tmp=$scope.$watch('zero',function(newVal,oldVal){
      	storage.set('zero',$scope.zero);
      },true) 
      tmp(); 
  ```
  The snippt purpose is to modify  localstorage.zero when $scope.zero has changed,direction is from model to   localstorage

  Now you can just use the provided way to bind date
  ```JAVASCRIPT
	storage.bind($scope,'zero','zero','normal');
	storage.unbind($scope,'zero','zero','normal');
  ```

## Feature coming soon
 New update modify comes later,forget the get -> operate -> set order.
  
  Please add an issue with ideas, improvements, or bugs! Thanks!
  You can send me email ``hjj491229492@hotmail.com``

---

(c) 2013 MIT License


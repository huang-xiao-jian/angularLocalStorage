'use strict';

/**
 * @module storage.utils
 * @description - exposed storageUtils service, which contain several useful method
 */
angular.module('storage.utils', [])
	.factory('storageUtils', ['$log', function($log) {
		var destiny = {};

    /**
     * @description - pretreatment the value which would put into localStorage
     * @param {*} value
     * @returns {string} - string resolved through JSON.stringify()
     */
		destiny.resolveValue = function(value) {
			if (angular.isUndefined(value)) return null;
			if (angular.isDate(value)) return JSON.stringify('RESERVED-DATE' + value.toJSON());
			if (Object.prototype.toString.call(value) === '[object RegExp]') return JSON.stringify('RESERVED-REGEXP' + value.toString());
			return JSON.stringify(value);
		};

    /**
     * @description - parse the value from localStorage into origin variable
     * @param {string} value
     * @returns {*} - variable parsed through JSON.parse()
     */

    destiny.parseValue = function(value) {
			if (value === null) return null;
			if (value.indexOf('RESERVED-DATE') !== -1)  {
				return new Date(JSON.parse(value).replace('RESERVED-DATE', ''));
			}
			if (value.indexOf('RESERVED-REGEXP') !== -1) {
				var splitArray = JSON.parse(value).replace('RESERVED-REGEXP').split('/').slice(1);
				var flag = splitArray.pop();
				return new RegExp(splitArray.join('/'), flag);
			}
			return JSON.parse(value);
		};

    /**
     * @description - check if array have target
     * @param {Array} array - source array to check
     * @param {*} target - item variable to match
     * @returns {Boolean} - true for exists, false for the opposite
     */

    destiny.inArray = function(array, target) {
			return array.indexOf(target) !== -1;
		};

    /**
     * @description - unique the specific array
     * @param {Array} array - source array to unique
     * @returns {Array} - unique array without repeated value
     */
		destiny.uniqueArray = function(array) {
			var container = [];
			return array.filter(function(item) {
				if (container.indexOf(item) === -1) {
					container.push(item);
					return true;
				} else {
					return false;
				}
			});
		};

    destiny.pull = function(array, target) {
      return array.filter(function(item) {
        return !angular.equals(item, target);
      })
    };

		return destiny;
	}]);

/**
 * @module storage.operate
 * @description - exposed storageOperate service, which contain several localStorage operate method
 */
angular.module('storage.operate', ['storage.utils'])
  .factory('storageOperate', ['$window', 'storageUtils', '$log', function($window, storageUtils, $log) {
    var storage = $window.localStorage;

    var destiny = {};
    /**
     * Get - get the value stored in localStorage
     * @param key - the key string as accessor
     * @returns {*} - Object,String,Float,Boolean depending on what you stored
     */
    destiny.get = function(key) {
      return storageUtils.parseValue(storage.getItem(key));
    };

    /**
     * getByIndex - get the value stored in localStorage
     * @param index - the index you expected for the pair
     * @exception - different browser may use different sort method, and the index maybe not what you really want
     * @returns {*} - Object,String,Float,Boolean depending on what you stored
     */
    destiny.getByIndex = function(index) {
      return storageUtils.parseValue(storage.getItem(storage.key(index)));
    };

    /**
     * Set - set new localStorage key pair set
     * @param key - the key string as accessor
     * @param value - the value of the localStorage item
     * @exception - the localstorage has size limit
     */
    destiny.set = function(key, value) {
      if(storage.getItem(key)) storage.removeItem(key);
      storage.setItem(key, storageUtils.resolveValue(value));
    };

    /**
     * Remove - remove value from localStorage
     * @param key - the accessor value
     */
    destiny.remove = function(key) {
      storage.removeItem(key);
    };

    /**
     * Clear All - clear out ALL localStorage variables, use this carefully!
     */
    destiny.clear = function() {
      storage.clear();
    };

    /**
     * getSize - get localStorage variables length
     */
    destiny.getSize = function() {
      return storage.length;
    };

    return destiny;
  }]);

/**
 * @module storage.update
 * @description - exposed storageUpdate service, which contain several update method
 */
angular.module('storage.update', ['storage.operate', 'storage.utils'])
  .factory('storageUpdate', ['storageOperate', 'storageUtils', '$log', function(storageOperate, storageUtils, $log) {
    var destiny = {};

    /**
     * $inc - increase localStorage number value with specific key
     * @param {string} key - the key string as accessor
     * @param {number} value - the value to increase, negative accepted
     */
    destiny.$inc = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isNumber(storageValue) && angular.isNumber(value)){
        storageValue +=value;
        storageOperate.set(key, storageValue);
      }
    };

    /**
     * $inc - verse localStorage boolean value with specific key
     * @param {string} key - the key string as accessor
     */
    destiny.$verse = function(key) {
      var storageValue = storageOperate.get(key);
      if (storageValue === true || storageValue === false || toString.call(storageValue) === '[object Boolean]') {
        storageOperate.set(key, !storageValue);
      }
    };

    /**
     * $push - push item into localStorage array value with specific key
     * @param {string} key - the key string as accessor
     * @param {*} value - the value to push into the specific array
     */
    destiny.$push = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageOperate.set(key, storageValue.concat(value));
      }
    };

    /**
     * $addToSet - push item into localStorage array value with specific key, and ensure unique
     * @param {string} key - the key string as accessor
     * @param {*} value - the value to push into the specific array
     */
    destiny.$addToSet = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageValue = storageValue.concat(value);
        storageOperate.set(key, storageUtils.uniqueArray(storageValue));
      }
    };

    /**
     * $unique - unique localStorage array value with specific key, without repeated value
     * @param {string} key - the key string as accessor
     */
    destiny.$unique = function(key) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageOperate.set(key, storageUtils.uniqueArray(storageValue));
      }
    };

    /**
     * $extend - extend localStorage object value with specific key
     * @param {string} key - the key string as accessor
     * @param {object} value - the value to override the source
     */
    destiny.$extend = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isObject(storageValue) && angular.isObject(value)) {
        storageOperate.set(key, angular.extend(storageValue, value));
      }
    };

    /**
     * $pull - pull item out from localStorage array value with specific key
     * @param {string} key - the key string as accessor
     * @param {*} value - the value to pull out the specific array
     */
    destiny.$pull = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageOperate.set(key, storageUtils.pull(storageValue, value));
      }
    };

    return destiny;
  }]);

/**
 * @module storage.through
 * @description - exposed storage-bind directive, which execute data bind
 */
angular.module('storage.through', ['storage.operate', 'storage.utils'])
  .directive('storageBind', ['storageOperate', 'storageUtils', '$log', function(storageOperate, storageUtils, $log) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        'storageBind': '@',
        'storageBindDirection': '@'
      },
      link: function(scope, element, attr, ngModel) {
        if (storageOperate.get(scope.storageBind)) ngModel.$setViewValue(storageOperate.get(scope.storageBind));
        var forward = function() {
          ngModel.$parsers.push(function(value) {
            if (value) storageOperate.set(scope.storageBind, value);
            return value;
          });
        };
        var reverse = function() {
          ngModel.$formatters.push(function(value) {
            if (value) storageOperate.set(scope.storageBind, value);
            return value;
          });
        };
        switch (scope.storageBindDirection) {
          case 'forward':
            forward.apply();
            break;
          case 'reverse':
            reverse.apply();
            break;
          case 'normal':
            forward.apply();
            reverse.apply();
            break;
        }
      }
    }
  }]);

/**
* @module storage
* @description - integration which contain service and directive above
*/
angular.module('storage', ['storage.operate', 'storage.update', 'storage.through']);

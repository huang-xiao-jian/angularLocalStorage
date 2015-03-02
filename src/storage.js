'use strict';

angular.module('storage.utils', [])
	.factory('storageUtils', ['$log', function($log) {
		var destiny = {};

		destiny.resolveValue = function(value) {
			if (angular.isUndefined(value)) return null;
			if (angular.isDate(value)) return JSON.stringify('RESERVED-DATE' + value.toJSON());
			if (Object.prototype.toString.call(value) === '[object RegExp]') return JSON.stringify('RESERVED-REGEXP' + value.toString());
			return JSON.stringify(value);
		};

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

		destiny.inArray = function(array, target) {
			return array.indexOf(target) !== -1;
		};

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

angular.module('storage.operate', ['storage.utils'])
  .factory('storageOperate', ['$window', 'storageUtils', '$log', function($window, storageUtils, $log) {
    var storage = $window.localStorage;
    var destiny = {};
    /**
     * Get - let's you get the value of any pair you've stored
     * @param key - the string that you set as accessor for the pair
     * @returns {*} - Object,String,Float,Boolean depending on what you stored
     */
    destiny.get = function(key) {
      return storageUtils.parseValue(storage.getItem(key));
    };

    /**
     * getByIndex - let's you get the value of any pair you've stored by index
     * @param index - the index you expected for the pair
     * @returns {*} - Object,String,Float,Boolean depending on what you stored
     */
    destiny.getByIndex = function(index) {
      return storageUtils.parseValue(storage.getItem(storage.key(index)));
    };

    /**
     * Set - let's you set a new localStorage key pair set
     * @param key - a string that will be used as the accessor for the pair
     * @param value - the value of the localStorage item
     * @exception - the localstorage has size limit
     */
    destiny.set = function(key, value) {
      if(storage.getItem(key)) storage.removeItem(key);
      storage.setItem(key, storageUtils.resolveValue(value));
    };

    /**
     * Remove - let's you nuke a value from localStorage
     * @param key - the accessor value
     */
    destiny.remove = function(key) {
      storage.removeItem(key);
    };

    /**
     * Clear All - let's you clear out ALL localStorage variables, use this carefully!
     */
    destiny.clear = function() {
      storage.clear();
    };

    /**
     * getSize - let's you get localStorage variables length
     */
    destiny.getSize = function() {
      return storage.length;
    };

    return destiny;
  }]);

angular.module('storage.update', ['storage.operate', 'storage.utils'])
  .factory('storageUpdate', ['storageOperate', 'storageUtils', '$log', function(storageOperate, storageUtils, $log) {
    var destiny = {};
    destiny.$inc = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isNumber(storageValue) && angular.isNumber(value)){
        storageValue +=value;
        storageOperate.set(key, storageValue);
      }
    };

    destiny.$verse = function(key) {
      var storageValue = storageOperate.get(key);
      if (storageValue === true || storageValue === false || toString.call(storageValue) === '[object Boolean]') {
        storageOperate.set(key, !storageValue);
      }
    };

    destiny.$push = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageOperate.set(key, storageValue.concat(value));
      }
    };

    destiny.$addToSet = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageValue = storageValue.concat(value);
        storageOperate.set(key, storageUtils.uniqueArray(storageValue));
      }
    };

    destiny.$unique = function(key) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageOperate.set(key, storageUtils.uniqueArray(storageValue));
      }
    };

    destiny.$extend = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isObject(storageValue) && angular.isObject(value)) {
        storageOperate.set(key, angular.extend(storageValue, value));
      }
    };

    destiny.$pull = function(key, value) {
      var storageValue = storageOperate.get(key);
      if (angular.isArray(storageValue)) {
        storageOperate.set(key, storageUtils.pull(storageValue, value));
      }
    };

    return destiny;
  }]);

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

angular.module('storage', ['storage.operate', 'storage.update'])
  .factory('storage', ['$parse', 'storageOperate', 'storageUpdate', '$log',
    function ($parse, storageOperate, storageUpdate, $log) {
      var destiny = angular.copy(storageOperate);

      /**
       * Update - A similar function with set to avoid QUOTA_EXCEEDED_ERR in iphone/ipad
       * @param modify - shorthand method
       * @param storageKey - a string that will be used as the accessor for the pair
       * @param value - the value of the localStorage item
       */
      destiny.update = function(modify, storageKey, value) {
        switch(modify){
          case '$inc':
            storageUpdate.$inc(storageKey, value);
            break;
          case '$verse':
            storageUpdate.$verse(storageKey, value);
            break;
          case '$push':
            storageUpdate.$push(storageKey, value);
            break;
          case '$addToSet':
            storageUpdate.$addToSet(storageKey, value);
            break;
          case '$pull':
            storageUpdate.$pull(storageKey, value);
            break;
          case '$unique':
            storageUpdate.$unique(storageKey);
            break;
          case '$extend':
            storageUpdate.$extend(storageKey, value);
            break;
        }
      };
		return destiny;
	}]);  

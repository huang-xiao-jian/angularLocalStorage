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

angular.module('storage', ['storage.utils', 'storage.operate'])
  .factory('storage', ['$parse','$window', '$log', 'storageUtils',
		function ($parse, $log) {
  		var publicMethods = {
			/** Update - A similar function with set to avoid QUOTA_EXCEEDED_ERR in iphone/ipad
             * @param modify - shorthand method
			 * @param storageKey - a string that will be used as the accessor for the pair
			 * @param value - the value of the localStorage item
			 */
			update:function(modify, storageKey, value){
				switch(modify){
					case '$inc':
					    inc(storageKey, value);
					    break;
                    case '$verse':
                        verse(storageKey, value);
                        break;
					case '$push':
					    push(storageKey, value);
					    break;
                    case '$addToSet':
                        addToSet(storageKey, value);
                        break;
                    case '$pull':
                        pull(storageKey, value);
                        break;
					case '$unique':
					    unique(storageKey);
					    break;
					case '$extend':
					    extend(storageKey, value);
					    break;
				}


			},
		
			 /*
			    A object to store cancel functions that generate when apply $scope.$watch
			    for unnecessary judge, store the functions seperate
			 */
            "bindObjectReverse" : {},

            "bindObjectForward" : {},

			/** Bind - Make a data-binding in single way or both way
			 * @param $scope - this param is to inject $scope environment in my own opinion
			 * @param modelKey - angular expression that will be used to get value from the $scope 
			 * @param storageKey - the name of the localStorage item
			 * @param direction - data-binding direction , from model to localstorage or from localstorage to
			                      model or both way 

			 */
			bind: function($scope, modelKey, storageKey, direction){
                switch (direction) {
                   case 'forward' :
                     forwardBind();
                     break;
                   case 'reverse' :
                     reverseBind();
                     break;
                    case 'normal' :
                     forwardBind();
                     reverseBind();
                     break;
                   default :
                     forwardBind();
                     break;                                
                }

				function reverseBind(){
					var tmp = $scope.$watch(
							function (){
								return publicMethods.get(storageKey);
							},
		                    function(newVal){
		                       $parse(modelKey).assign($scope, newVal);
		                    },
		                    true
						);

                    $parse(storageKey).assign(publicMethods.bindObjectReverse, tmp);	
				}

				function forwardBind(){
					var tmp = $scope.$watch(
							function(){
								return $parse(modelKey)($scope);
							},
		                    function(newVal){
		                    	publicMethods.set(storageKey, newVal);
		                    },
		                    true
						);
                    
					$parse(modelKey).assign(publicMethods.bindObjectForward, tmp);
				}				
			},

			/** unbind - cancel data-binding in single way or both way
			 * @param $scope - this param is to inject $scope environment in my own opinion
			 * @param modelKey - angular expression that will be used to get value from the $scope 
			 * @param storageKey - the name of the localStorage item
			 * @param direction - data-binding cancel direction , from model to local storage or from local storage to
			                      model or both way 

			 */
			unbind : function($scope, modelKey, storageKey, direction){

                switch (direction) {
                   case 'forward' :
                     forwardUnbind();
                     break;
                   case 'reverse' :
                     reverseUnbind();
                     break;
                    case 'normal' :
                        forwardUnbind();
                        reverseUnbind();
                        break;
                   default :
                     forwardUnbind();
                     break;                                
                }

               function reverseUnbind(){
               	  $parse(storageKey)(publicMethods.bindObjectReverse).apply(this);
               }

               function forwardUnbind(){
               	   $parse(modelKey)(publicMethods.bindObjectForward).apply(this);
               }
			}
		};
		return destiny;
	}]);  

angular.module('storage', [])
  .factory('storage', ['$parse','$window', '$log',
      function ($parse, $window, $log) {
		/**
		 * Global Vars
		 */
		var storage = (typeof $window.localStorage === 'undefined') ? undefined : $window.localStorage;
		var privateMethods = {
            resolveValue: function(key, value) {
                if (angular.isDate(value)) {
                    value = angular.toJson("love-date-json" + value.toJSON());
                } else if (Object.prototype.toString.call(value) === '[object RegExp]'){
                    value = angular.toJson("love-regexp-string" + value.toString());
                } else {
                    value = angular.toJson(value);
                }
                storage.setItem(key, value);
            },
			/**
			 * Pass any type of a string from the localStorage to be parsed
			 * @param res - a string that will be parsed for type
			 * @returns {*} - whatever the real value of stored value was
			 */
			parseValue: function (res) {
				var val;
				try {
					val = angular.fromJson(res);
					if (typeof val === 'undefined') {
						val = 'undefined';
					}
					if (val === 'true') {
						val = true;
					}
					if (val === 'false') {
						val = false;
					}
                    if (val.indexOf('love-date-json') !== -1) {
                        val = val.replace('love-date-json', '');
                        val = new Date(val);
                    }
                    if (val.indexOf('love-regexp-string') !== -1) {
                        val = val.split('/');
                        val = new RegExp(val[1], val[2]);
                    }
				} catch (e) {
					$log.info(e.message);
				}
				return val;
			},

			inArray : function(needle,array){  
               if(angular.isArray(array)){
               	  var flag = false;
          	      angular.forEach(array, function(value){
          	      	 if(angular.equals(needle,value)){
          	      	 	flag = true;
          	      	 }
          	      });
          	      return flag;
               }
			},

			unique : function(array){
               if(angular.isArray(array)){
				   var tmp = {}, destiny = [];
				   angular.forEach(array, function(value, key){
				      if(!tmp.hasOwnProperty(value)) {
				         destiny.push(value);
				         tmp[value] = 1;	
				      }			   	
				   });
				   return destiny;               	
               }
			}  
		};

		var publicMethods = {
			/**
			 * Set - let's you set a new localStorage key pair set
			 * @param key - a string that will be used as the accessor for the pair
			 * @param value - the value of the localStorage item
			 * @exception - the localstorage has size limit  
			 */
			set: function (key, value) {
			   if(storage.getItem(key)){
				   storage.removeItem(key);	
			   }

			   try {
                   privateMethods.resolveValue(key, value);
			   } catch(e) {
                   $log.info(e.message);
			   }
			   
			},

			/**
			 * Get - let's you get the value of any pair you've stored
			 * @param key - the string that you set as accessor for the pair
			 * @returns {*} - Object,String,Float,Boolean depending on what you stored
			 */
			get: function (key) {
				return privateMethods.parseValue(storage.getItem(key));
			},

			/**
			 * Remove - let's you nuke a value from localStorage
			 * @param key - the accessor value
			 */
			remove: function (key) {
				storage.removeItem(key);
			},

			/**
			 * Clear All - let's you clear out ALL localStorage variables, use this carefully!
			 */
 			clear: function() {
				storage.clear();
			},

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

				function inc(storageKey, value){
					var storageValue = publicMethods.get(storageKey);
					if (angular.isNumber(storageValue)){
				      storageValue +=value;
                      publicMethods.set(storageKey, storageValue)
					} else {
						return false;
					}
				}

                function verse(storageKey) {
                    var storageValue = publicMethods.get(storageKey);
                    if (angular.equals(storageValue, true)) {
                        storageValue = false;
                        publicMethods.set(storageKey, storageValue);
                    } else if (angular.equals(storageValue, false)) {
                        storageValue = true;
                        publicMethods.set(storageKey, storageValue);
                    } else {
                        return false;
                    }
                }

				function push(storageKey, value){
					var storageValue = publicMethods.get(storageKey);
					if(angular.isArray(storageValue)){
					    storageValue = storageValue.concat(value);
                        publicMethods.set(storageKey, storageValue);
					}else{
						return false;
					}
				}

				function addToSet(storageKey, value){
                    var storageValue = publicMethods.get(storageKey);
                    if (angular.isArray(storageValue) && !angular.isArray(value)){
		                if (!privateMethods.inArray(value, storageValue)) {
		                    storageValue.push(value);
		                }
                        publicMethods.set(storageKey, storageValue);
                    }else{
	                    return false;
	                }     
				}

                function pull(storageKey, value) {
                    var storageValue = publicMethods.get(storageKey);
                    if(angular.isArray(storageValue)){
                        while (storageValue.indexOf(value) !== -1) {
                            var index = storageValue.indexOf(value);
                            storageValue.splice(index, 1);
                        }
                        publicMethods.set(storageKey, storageValue);
                    }else{
                        return false;
                    }
                }

				function unique(storageKey){
					var storageValue = publicMethods.get(storageKey);
					if(angular.isArray(storageValue)){
                      publicMethods.set(storageKey,privateMethods.unique(storageValue));
					}else{
						return false;
					}
				}

				function extend(storageKey,value){
					var storageValue = publicMethods.get(storageKey);
					if(angular.isObject(storageValue) && angular.isObject(value)){
						angular.extend(storageValue, value);
						publicMethods.set(storageKey,storageValue);
					}
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
			 * @param direction - data-binding dirction , from model to localstorage or from localstorage to 
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
                   default :
                     forwardBind();
                     break;                                
                }

				function reverseBind(){
					var tmp = $scope.$watch(
							function (){
								return publicMethods.get(storageKey)
							},
		                    function(newVal, oldVal){
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
		                    function(newVal,oldVal){
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
                   default :
                     forwardUnbind();
                     break;                                
                }

               function reverseUnbind(){
               	  $parse(storageKey)(publicMethods.bindObjectReverse).apply();
               }

               function forwardUnbind(){
               	  $parse(modelKey)(publicMethods.bindObjectForward).apply();
               }
			}
		};
		return publicMethods;
	}]);  

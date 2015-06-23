'use strict';
angular.module('LetLifeBack')
	.controller('MemoEditCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'MemoTemplates', 'Categories', 'Users',
		function ($scope, $rootScope, $routeParams, $location, MemoTemplates, Categories, Users) {
		    /*
		    scope: {
		    selectedCatOption: "="
		    },
		    controller: function ($scope) {
		    debugger;
		    }
		    */

		    Categories.get()
			.success(function (data, status, headers, config) {
			    //console.log(data);
			    $scope.categories = data.categories;
			})
			.error(function (data, status, headers, config) {
			    alert("Errore #" + status);
			});

		    MemoTemplates.getSlotTypes()
               .success(function (data, status, headers, config) {
                   //console.log(data);
                   $scope.types = data.types;
               })
			.error(function (data, status, headers, config) {
			    alert("Errore #" + status);
			});

		    MemoTemplates.getTriggerTypes()
            .success(function (data, status, headers, config) {
                //console.log(data);
                $scope.triggers = data.types;
            })
			.error(function (data, status, headers, config) {
			    alert("Errore #" + status);
			});

		    $scope.Update = function () {
		        debugger;

		        var data = '{ "memotemplate":{ "title" : ' + angular.toJson($scope.memo.name) +
                            ', "categoryId": ' + $scope.memo.category +
                            ', "description": ' + angular.toJson($scope.memo.description) +
                            ', "slotTypeId": ' + angular.toJson($scope.memo.type) +
                            ', "triggerTypeId": ' + angular.toJson($scope.memo.trigger) +
                            ', "priority": ' + $scope.memo.priority +
                            ', "triggerData": { ' + triggerData + ' }   }	}';

		    }

		    $scope.Create = function () {

		        var triggerData = "";

		        if ($scope.memo.trigger == "Timer") {
		            triggerData = '"repeat": ' + $scope.memo.repeat;

		            if ($scope.memo.repeat == 3) {
		                triggerData += ', "repeatDoW": ' + angular.toJson($scope.memo.day) + '';
		            }
		        }

		        var data = '{ "memotemplate":{ "title" : ' + angular.toJson($scope.memo.name) +
                            ', "categoryId": ' + $scope.memo.category +
                            ', "description": ' + angular.toJson($scope.memo.description) +
                            ', "slotTypeId": ' + angular.toJson($scope.memo.type) +
                            ', "triggerTypeId": ' + angular.toJson($scope.memo.trigger) +
                            ', "priority": ' + $scope.memo.priority +
                            ', "triggerData": { ' + triggerData + ' }   }	}';

		        MemoTemplates.post(data)
				.success(function (data, status, headers, config) {
				    console.log(data);
				    //feedback to user
				    $scope.success = true;
				})
				.error(function (data, status, headers, config) {
				    alert("Errore #" + status);
				});


		    };


		    var idMemo = $routeParams.memotemplateId;
		    MemoTemplates.getDetail(idMemo)
				.success(function (data, status, headers, config) {
				    /*
				    $scope.name = data.memotemplate.title;
				    $scope.slotType = data.memotemplate.slotTypeId;
				    $scope.triggerType = data.memotemplate.triggerTypeId;
				    */
				    $scope.memo.name = data.memotemplate.title;
				    $scope.memo.description = data.memotemplate.description;
				    $scope.memo.category = data.memotemplate.categoryId;
				    $scope.memo.type = data.memotemplate.slotTypeId;
				    $scope.memo.priority = data.memotemplate.priority;
				    $scope.memo.repeat = data.memotemplate.triggerData.repeat;
				    $scope.memo.trigger = data.memotemplate.triggerTypeId;

				    debugger;




				    /*
				    var triggerData = "";
				    if (data.memotemplate.triggerTypeId == "Timer") {
				    var repeat = data.memotemplate.triggerData.repeat;
				    var repeatString = "";

				    if (repeat == 0) {
				    repeatString = "No repeat";
				    } else if (repeat == 1) {
				    repeatString = "Annual event";
				    } else if (repeat == 2) {
				    repeatString = "Monthly event";
				    } else if (repeat == 3) {
				    repeatString = "Daily event";
				    }

				    triggerData = "Repeat: " + repeatString;

				    if (repeat == 3) {
				    triggerData += " - (mo: " + data.memotemplate.triggerData.repeatDoW.mo + ", tu:" + data.memotemplate.triggerData.repeatDoW.tu + ", we: " + data.memotemplate.triggerData.repeatDoW.we + ", th: " + data.memotemplate.triggerData.repeatDoW.th + ", fr: " + data.memotemplate.triggerData.repeatDoW.fr + ", sa: " + data.memotemplate.triggerData.repeatDoW.sa + ", su: " + data.memotemplate.triggerData.repeatDoW.su + ")";
				    }
				    }
				    $scope.triggerData = triggerData;


				    $scope.popularity = data.memotemplate.weight;
				    $scope.date = data.memotemplate.creationTime;

				    if (!angular.isUndefined(data.memotemplate.lastCall)) {
				    $scope.last_call = data.memotemplate.lastCall;
				    }
				    else {
				    $scope.last_call = "n/d";
				    }

				    if (!angular.isUndefined(data.memotemplate.description)) {
				    $scope.description = data.memotemplate.description;
				    }
				    else {
				    $scope.description = "n/d";
				    }

				    //TODO: 
				    //$scope.visualization 
				    //$scope.suggestion
				    //$scope.other

				    var categoryId = data.memotemplate.categoryId;
				    var userId = data.memotemplate.createdBy;

				    //get category
				    if (!angular.isUndefined(categoryId)) {
				    Categories.get()
				    .success(function (data, status, headers, config) {

				    var categoryMap = [];

				    data.categories.forEach(function (category, index, array) {
				    categoryMap[category._id] = category.title;
				    });

				    $scope.category = categoryMap[categoryId];
				    });
				    }

				    //get user
				    Users.getDetail(userId)
				    .success(function (data, status, headers, config) {
				    $scope.createdBy = data.user.first + " " + data.user.last + " - " + data.user.email;
				    })
				    .error(function (data, status, headers, config) {
				    alert("Errore #" + status);
				    });
					
				    */
				});




		} ]);

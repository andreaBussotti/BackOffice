'use strict';
angular.module('LetLifeBack')
	.controller('MemoCreateCtrl', ['$scope', '$rootScope', '$location', 'MemoTemplates', 'Categories',
		function ($scope,    $rootScope,   $location, MemoTemplates, Categories) {

			Categories.get()
			.success(function(data, status, headers, config){
				//console.log(data);
				$scope.categories = data.categories;
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});

            MemoTemplates.getSlotTypes()
               .success(function(data, status, headers, config){
				//console.log(data);
				$scope.types = data.types;
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});

			MemoTemplates.getTriggerTypes()
            .success(function(data, status, headers, config){
				//console.log(data);
				$scope.triggers = data.types;
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});


			$scope.Create = function() {
				
				var triggerData = "";
				
				if($scope.memo.trigger == "Timer") {
					triggerData = '"repeat": '+$scope.memo.repeat;
				
					if($scope.memo.repeat==3) {
						triggerData += ', "repeatDoW": '+angular.toJson($scope.memo.day)+'';
					}
				}
				
				var data = '{ "memotemplate":{ "title" : '+angular.toJson($scope.memo.name)+', "categoryId": '+$scope.memo.category+', "description": '+angular.toJson($scope.memo.description)+', "slotTypeId": '+angular.toJson($scope.memo.type)+', "triggerTypeId": '+angular.toJson($scope.memo.trigger)+', "priority": '+$scope.memo.priority+', "triggerData": { '+triggerData+' }   }	}';
				
				MemoTemplates.post(data)
				.success(function(data, status, headers, config){
					console.log(data);
					//feedback to user
					$scope.success = true;		
				})
				.error(function(data, status, headers, config){
					alert("Errore #" + status);
				});
				
				
			};

  	}]);

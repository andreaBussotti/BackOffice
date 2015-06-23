'use strict';
angular.module('LetLifeBack')
	.controller('MemoDetailCtrl', ['$scope', '$rootScope', '$routeParams', 'MemoTemplates', 'Categories', 'Users',
		function ($scope,    $rootScope, $routeParams, MemoTemplates, Categories, Users) {

			var idMemo = $routeParams.memotemplateId;	

			MemoTemplates.getDetail(idMemo)
				.success(function(data, status, headers, config){
				
				$scope.name = data.memotemplate.title;
				$scope.slotType = data.memotemplate.slotTypeId;
				$scope.triggerType = data.memotemplate.triggerTypeId;
				
				var triggerData = "";
				if(data.memotemplate.triggerTypeId == "Timer"){
					var repeat = data.memotemplate.triggerData.repeat;				
					var repeatString = "";
					
					if(repeat == 0){
						repeatString = "No repeat";
					} else if(repeat == 1) {
						repeatString = "Annual event";
					} else if(repeat == 2) {
						repeatString = "Monthly event";
					} else if(repeat == 3) {
						repeatString = "Daily event";
					}
					
					triggerData = "Repeat: "+repeatString;
					
					if(repeat == 3) {
						triggerData += " - (mo: "+data.memotemplate.triggerData.repeatDoW.mo+", tu:"+data.memotemplate.triggerData.repeatDoW.tu+", we: "+data.memotemplate.triggerData.repeatDoW.we+", th: "+data.memotemplate.triggerData.repeatDoW.th+", fr: "+data.memotemplate.triggerData.repeatDoW.fr+", sa: "+data.memotemplate.triggerData.repeatDoW.sa+", su: "+data.memotemplate.triggerData.repeatDoW.su+")";
					}
				}
				$scope.triggerData = triggerData;
				
				
				$scope.popularity = data.memotemplate.weight;
				$scope.date = data.memotemplate.creationTime;
				
				if(!angular.isUndefined(data.memotemplate.lastCall)) {
					$scope.last_call = data.memotemplate.lastCall;
				}
				else {
					$scope.last_call = "n/d";
				}
				
				if(!angular.isUndefined(data.memotemplate.description)) {
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
				if(!angular.isUndefined(categoryId)) {
					Categories.get()
						.success(function(data, status, headers, config) {		
				
							var categoryMap = [];
							
							data.categories.forEach(function(category, index, array) {
								categoryMap[category._id] = category.title;
							});
							
							$scope.category = categoryMap[categoryId];
					});
				}			
				
				//get user
				Users.getDetail(userId) 
					.success(function(data, status, headers, config) {
						$scope.createdBy = data.user.first + " " + data.user.last + " - " + data.user.email;
					})
					.error(function(data, status, headers, config){
						alert("Errore #" + status);
					});
				
				
			
			
			});

			

            
  	}]);

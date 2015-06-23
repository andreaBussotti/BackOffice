'use strict';
angular.module('LetLifeBack')
	.controller('NotificationCreateCtrl', ['$scope', '$rootScope', '$location', 'Notifications', 'UsersTag',
		function ($scope,    $rootScope,   $location, Notifications, UsersTag) {


			/*TAG USERS*/
			$scope.tagsSelected = [];
			$scope.tags = [];		
			var tagList = "";		
			
			$scope.totalUser = 0;	
		
			UsersTag.get()
			.success(function(data, status, headers, config){
				console.log(data);	
				tagList = data.tags;
				
				//get user count
				angular.forEach(tagList, function(value, key) {
				  
				 UsersTag.getUsersTag(value._id) 
				 .success(function(dataTag, status, headers, config){				
					$scope.tags.push({_id: value._id, color: value.color, label: value.label, count: dataTag.total});					
				 });
				  
				});			
			})

		
			$scope.addTagNotification = function(idTag) {
				
				 var find = false;
				 angular.forEach($scope.tagsSelected, function(value, key) {					
					if(value._id == idTag){
						find = true;
					}			 
				 });
				 
				 if(find==false) {
					 					 				
					UsersTag.getDetail(idTag)
					.success(function(dataDetailTag, status, headers, config){
						
						 UsersTag.getUsersTag(idTag) 
						 .success(function(dataCount, status, headers, config){				
							$scope.tagsSelected.push({_id: dataDetailTag._id, color: dataDetailTag.color, label: dataDetailTag.label, count: dataCount.total});					
						 
							$scope.totalUser = $scope.totalUser+dataCount.total;
						 });					
					});
				}
				
			};

			$scope.deleteTagNotification = function(idTag, index) {
				
				UsersTag.getDetail(idTag)
					.success(function(dataDetailTag, status, headers, config){
						
						 UsersTag.getUsersTag(idTag) 
						 .success(function(dataCount, status, headers, config){				
							$scope.tagsSelected.splice(index, 1);						 
							$scope.totalUser = $scope.totalUser-dataCount.total;
						 });					
					});	
			};


			$scope.Create = function() {
				
				var url = "\"\"";
				
				if(!angular.isUndefined($scope.notification.url)) {
					url = angular.toJson($scope.notification.url);
				}
				
				
				var recipients = [];
				 angular.forEach($scope.tagsSelected, function(value, key) {					
					recipients.push(value._id);		 
				 });			 
				
				var data = '{ "message":{ "title" : '+angular.toJson($scope.notification.title)+', "message": '+angular.toJson($scope.notification.message)+', "url": '+url+', "target": '+angular.toJson($scope.notification.target)+', "priority": '+$scope.notification.priority+', "icon": '+angular.toJson($scope.notification.icon)+', "recipients": '+angular.toJson(recipients)+'   }	}';

				
				Notifications.post(data)
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

'use strict';
angular.module('LetLifeBack')
	.controller('NotificationDetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Notifications', 'Users', 'UsersTag',
		function ($scope,    $rootScope, $routeParams, Notifications, Users, UsersTag) {

			var idNotification = $routeParams.notificationId;	

			Notifications.getDetail(idNotification)
				.success(function(data, status, headers, config){
				
				$scope.name = data.message.title;
				$scope.message = data.message.message;
				$scope.url = data.message.url;
				$scope.datecreated = data.message.creationDate;
				$scope.datesend = data.message.sendDate;
				$scope.priority = data.message.priority;
				$scope.target = data.message.target;
				$scope.icon = data.message.icon;				
				
				
				var userId = data.message.sender;	
			
				//get user
				Users.getDetail(userId) 
					.success(function(data, status, headers, config) {
						$scope.sender = data.user.first + " " + data.user.last + " - " + data.user.email;
					})
					.error(function(data, status, headers, config){
						alert("Errore #" + status);
					});
				
				
				//get recipients
				$scope.recipients = "";
				if($scope.target == "userTags") {
					angular.forEach(data.message.recipients, function(value, key) {					
					
						UsersTag.getDetail(value)
						.success(function(data, status, headers, config) {						
							$scope.recipients = $scope.recipients+ " "+ data.label+", ";
						})					
				 }
				 //$scope.recipients = $scope.recipients.substr( 0,$scope.recipients.lenght-5 );
				 );
				 
				 	
				}

			});
    
  	}]);

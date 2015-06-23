'use strict';
angular.module('LetLifeBack')
	.controller('UsersCreateCtrl', ['$scope', '$rootScope', '$location', 'Users',
		function ($scope,    $rootScope,   $location, Users) {


			$scope.Create = function() {
				
				var permission = "";
				
				if($scope.us.permission != "" && $scope.us.permission != undefined) {
					permission = ', "permissions" : ['+angular.toJson($scope.us.permission)+']';
				}
				
				var data = '{ "first" : '+angular.toJson($scope.us.first)+', "last": '+angular.toJson($scope.us.last)+', "gender": '+angular.toJson($scope.us.gender)+', "email": '+angular.toJson($scope.us.email)+', "phoneNumber": '+angular.toJson($scope.us.phone)+', "password": '+angular.toJson($scope.us.password)+permission+' }';				
				
				Users.post(data)
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

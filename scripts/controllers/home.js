'use strict';
angular.module('LetLifeBack')
	.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'Login',
		function ($scope,    $rootScope,   $location, Login) {
	
	
		console.log(window.location.host);
	
		$scope.Login = function() {
			$scope.error = false;
			
			
			var data = '{ "grant_type": "password", "username" : '+angular.toJson($scope.us.username)+', "password": '+angular.toJson($scope.us.password)+' }';
			
			Login.signup(data)
			.success(function(data, status, headers, config){
				$rootScope.$emit("login", data.access_token);
			})
			.error(function(data, status, headers, config){
				$scope.error = true;
			});
	
			
		};
	
	}]);

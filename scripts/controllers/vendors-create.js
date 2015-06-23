'use strict';
angular.module('LetLifeBack')
	.controller('VendorsCreateCtrl', ['$scope', '$rootScope', '$location', 'Vendors',
		function ($scope,    $rootScope,   $location, Vendors) {


			$scope.Create = function() {
				var data = '{ "vendor": { "name" : '+angular.toJson($scope.vendor.name)+', "customDomain": '+angular.toJson($scope.vendor.domain) + ' } }';

				Vendors.post(data)
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

'use strict';
angular.module('LetLifeBack')
	.controller('VendorsDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Vendors', 'Users', 'ngDialog',
		function ($scope, $rootScope,  $routeParams, $location, Vendors, Users, ngDialog) {
	
		
		var idVendor = $routeParams.vendorId;	
		
		$scope.users = [];
		$scope.userAllChecked = [];
		$scope.userChecked = [];

		
		Vendors.getDetail(idVendor)
			.success(function(data, status, headers, config){
				
				$scope.VendorName = data.vendor.name;
				
				if(!angular.isUndefined(data.vendor.customDomain)) {
					$scope.VendorDomain = data.vendor.customDomain;
				}
				else{
					$scope.VendorDomain = "";				
				}			
				console.log(data);			
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});
                   
		
		
			$scope.Update = function() {
				var data = '{ "vendor": { "name" : '+angular.toJson($scope.VendorName)+', "customDomain": '+angular.toJson($scope.VendorDomain) + ' } }';

				Vendors.put(idVendor, data)
				.success(function(data, status, headers, config){
					console.log(data);
					//feedback to user
					$scope.success = true;		
				})
				.error(function(data, status, headers, config){
					alert("Errore #" + status);
				});
				
			};
		
		
		
		Vendors.getUsers(idVendor) 
		 .success(function(dataUsers, status, headers, config){				
			$scope.users = dataUsers.users;		
		 });
		 
		 // toggle selection for a given user by _id
		  $scope.toggleSelection = function toggleSelection(userId) {
			 var idx = $scope.userChecked.indexOf(userId);

			 // is currently selected
			 if (idx > -1) {
			   $scope.userChecked.splice(idx, 1);
			 }

			 // is newly selected
			 else {
			   $scope.userChecked.push(userId);
			 }
		   };
		
		
		 $scope.delUsers = function() {				
				
			ngDialog.openConfirm({
				template: 'deleteUsersConfirm',
				className: 'ngdialog-theme-default'
			}).then(function () {		
				
				var delId = "";
				var i = 1;
				angular.forEach($scope.userChecked, function(value, key) {		
						
					delId += '"'+value+'"';
					
					if(i<$scope.userChecked.length) {
						delId += ', ';
					}					
					i++;
				});
				
				var dataUser = '['+delId+']';			
				
				Vendors.removeUsers(idVendor, dataUser)
				.success(function(data, status, headers, config){
				
					 //reload list of users					
					 $scope.userChecked = [];
					 Vendors.getUsers(idVendor) 
					 .success(function(dataUsers, status, headers, config){				
						$scope.users = dataUsers.users;		
					 });
										 
				});	
				
			});		
		};		

		
		
		 // toggle selection for a given user by _id
		  $scope.toggleSelectionUsers = function toggleSelectionUsers(userId) {
			 
			 var idx = $scope.userAllChecked.indexOf(userId);

			 // is currently selected
			 if (idx > -1) {
			   $scope.userAllChecked.splice(idx, 1);
			 }

			 // is newly selected
			 else {
			   $scope.userAllChecked.push(userId);
			 }
		   };
		
		
		$scope.addUsers = function() {

			$scope.userAllChecked = [];

			Users.get(1, 1, "last")			
				.success(function(data, status, headers, config){   
				
				Users.get(data.total, 1, "last")
				.success(function(listaUsers, status, headers, config){ 
					$scope.usersAll = listaUsers.data;
				});	
					
				console.log(data);	
			
			});

			ngDialog.open({
				template: 'selectUsersVedor',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		
		};
		
		
		
		$scope.saveUsers = function() {	
			var addId = "";
				var i = 1;
				angular.forEach($scope.userAllChecked, function(value, key) {		
						
					addId += '"'+value+'"';
					
					if(i<$scope.userAllChecked.length) {
						addId += ', ';
					}					
					i++;
				});
				
				var dataUser = '['+addId+']';			
				
				Vendors.addUsers(idVendor, dataUser)
				.success(function(data, status, headers, config){
				
					 //reload list of users
					 $scope.userAllChecked = [];
					Vendors.getUsers(idVendor) 
					 .success(function(dataUsers, status, headers, config){				
						$scope.users = dataUsers.users;		
					 });
					 
				});	
				
				//close ngDialog
				ngDialog.close();
		};
		
  	}]);

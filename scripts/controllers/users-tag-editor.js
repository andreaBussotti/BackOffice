'use strict';
angular.module('LetLifeBack')
	.controller('UsersTagCtrl', ['$scope', '$rootScope', '$location', 'UsersTag', 'Users', 'ngDialog',
		function ($scope,    $rootScope,   $location, UsersTag, Users, ngDialog) {
			
			$scope.tags = [];		
			$scope.users = [];
			$scope.usersAll = [];
			
			$scope.userAllChecked = [];
			$scope.userChecked = [];
			
			var tagList = "";
			$scope.tagSelected = "";
			$scope.indexSelected = "";
			
			UsersTag.get()
			.success(function(data, status, headers, config){
				console.log(data);	
				tagList = data.tags;
				
				//get user count
				angular.forEach(tagList, function(value, key) {
				  
				 UsersTag.getUsersTag(value._id) 
				 .success(function(dataTag, status, headers, config){				
					$scope.tags.push({id: value._id, color: value.color, label: value.label, count: dataTag.total});					
				 });
				  
				});
				
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});
			
			
		    $scope.addTag = function(){
				$scope.newtag.label = "";
				$scope.newtag.color = "";
				
				$scope.ACTION_TAG = "Create";
				$scope.LABEL_TAG = "Add";
				
				ngDialog.open({
					template: 'tagCreate',
					className: 'ngdialog-theme-default',
					scope: $scope
				});
			};
			
			
			$scope.editTag = function(idTag) {
				
				$scope.ACTION_TAG = "Edit";
				$scope.LABEL_TAG = "Edit";
				
				//get tag detail
				UsersTag.getDetail(idTag)
				.success(function(data, status, headers, config){				
					
					$scope.newtag.label = data.label;
					$scope.newtag.color = data.color;
					
					ngDialog.open({
						template: 'tagCreate',
						className: 'ngdialog-theme-default',
						scope: $scope
					});
										
				 });
		
			}

						
			$scope.saveTag = function(action) {
				
				var data = '{"label" : '+angular.toJson($scope.newtag.label)+', "color" : '+angular.toJson($scope.newtag.color)+' }';
				
				if(action == "Create") {
			
					UsersTag.post(data)
					.success(function(data, status, headers, config){
						//reload list of tag									
						$scope.tags.push({id: data._id, color: data.color, label: data.label, count: 0});				
						
						//close ngDialog
						ngDialog.close();
						
						//clean form
						$scope.newtag.label = "";
						$scope.newtag.color = "";
					})
					.error(function(data, status, headers, config){
						alert("Errore #" + status);
					});
				}
				else if(action == "Edit") {
					UsersTag.put($scope.tagSelected, data)
					.success(function(dataEdit, status, headers, config){			
						
						var tagEdCount = $scope.tags[$scope.indexSelected].count;
						
						//reload list of tag	
						$scope.tags.splice($scope.indexSelected, 1, {id: dataEdit._id, color: dataEdit.color, label: dataEdit.label, count: tagEdCount});
						
						//close ngDialog
						ngDialog.close();
						
						//clean form
						$scope.newtag.label = "";
						$scope.newtag.color = "";
					})
				}
			};
						
			
			$scope.deleteTag = function(idTag, index) {				
				
				ngDialog.openConfirm({
					template: 'deleteTagConfirm',
					className: 'ngdialog-theme-default'
				}).then(function () {					
					UsersTag.delete(idTag)
					.success(function(data, status, headers, config){
					
					//reload list of tag	
					 $scope.tags.splice(index, 1);
					});	
					
				});
			
			};

			
			$scope.loadUsers = function(idTag, index) {
			
				$scope.tagSelected = idTag;
				$scope.indexSelected = index;
			
				$scope.userChecked = [];
			
				UsersTag.getUsersTag(idTag) 
				 .success(function(dataUsers, status, headers, config){				
					$scope.users = dataUsers.users;		
				 });
				 			
			};
			
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
			
			
		$scope.delUsers = function(idTag,index) {				
				
			ngDialog.openConfirm({
				template: 'deleteTagConfirm',
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
				
				UsersTag.removeUserTag(idTag, dataUser)
				.success(function(data, status, headers, config){
				
					 //reload list of tag and list of users
					 var tagCount = ($scope.tags[$scope.indexSelected].count - $scope.userChecked.length);
					 var tagId = $scope.tags[$scope.indexSelected].id;
					 var tagColor = $scope.tags[$scope.indexSelected].color;
					 var tagLabel = $scope.tags[$scope.indexSelected].label;
							
					 //reload list of tag	
					 $scope.tags.splice($scope.indexSelected, 1, {id: tagId, color: tagColor, label: tagLabel, count: tagCount});			
				
					 $scope.userChecked = [];
					 UsersTag.getUsersTag(idTag) 
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
				template: 'selectUsersTag',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		
		};


		$scope.saveUsers = function(idTag) {											
				
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
				
				UsersTag.addUserTag(idTag, dataUser)
				.success(function(data, status, headers, config){
				
					 //reload list of tag and list of users
					 var tagCount = ($scope.tags[$scope.indexSelected].count + $scope.userAllChecked.length);
					 var tagId = $scope.tags[$scope.indexSelected].id;
					 var tagColor = $scope.tags[$scope.indexSelected].color;
					 var tagLabel = $scope.tags[$scope.indexSelected].label;
							
					 //reload list of tag	
					 $scope.tags.splice($scope.indexSelected, 1, {id: tagId, color: tagColor, label: tagLabel, count: tagCount});			
				
					 $scope.userAllChecked = [];
					 UsersTag.getUsersTag(idTag) 
					 .success(function(dataUsers, status, headers, config){				
						$scope.users = dataUsers.users;		
					 });
					 
				});	
				
				//close ngDialog
				ngDialog.close();
				
			
		};		

  	}]);

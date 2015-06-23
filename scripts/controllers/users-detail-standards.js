'use strict';
angular.module('LetLifeBack')
	.controller('UsersDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Users', 'Storage', 'Categories', 'UsersTag', 'ngDialog',
		function ($scope,    $rootScope,  $routeParams, $location, Users, Storage, Categories, UsersTag, ngDialog) {
	
		
		var idUser = $routeParams.userId;	
		
		$scope.tags = [];	
		
		Users.getDetail(idUser)
			.success(function(data, status, headers, config){
				
				var permission = data.user.permissions;
				if(permission.indexOf("letlife.editor") != -1){
					$scope.editor = true;
				}
				else {
					$scope.editor = false;
				}
				
				
				if(data.user.gender != null) {
					$scope.gender = data.user.gender;
				}
				else {
					$scope.gender = "n/d";
				}
				
				
				$scope.name = data.user.first + " " +data.user.last;
				
				$scope.username = data.user.email;
				var urlphoto = data.user.avatar;
				
				//get photo
				if(urlphoto!="undefined" && urlphoto!=undefined && urlphoto!="" && urlphoto!=null) {
					Storage.get(urlphoto) 
					.success(function(dataphoto, status, headers, config) {
						$scope.urlphoto = dataphoto.result.signedUrl;
					})
					.error(function(dataphoto, status, headers, config){
						alert("Errore #" + status);
					});
				}
				
				if(!angular.isUndefined(data.user.stats)) { 
					$scope.totaccess = data.user.stats.logins_counter; 
				}
				else {
					$scope.totaccess = 0;
				}
				
				if(!angular.isUndefined(data.user.lastAccess)) { 
					var lastAcc = data.user.lastAccess;
					
					$scope.last_access = data.user.lastAccess;
					
					$scope.last_access =  lastAcc.slice(8,10)+"/"+lastAcc.slice(5,7)+"/"+lastAcc.slice(0,4);
				}
				else {
					$scope.last_access = "n/d";
				}
				
				
				if(!angular.isUndefined(data.user.stats)) {
					if(!angular.isUndefined(data.user.stats.pois_counter)) {
						$scope.totpoi = data.user.stats.pois_counter;
					}
					else {
						$scope.totpoi = 0;
					}
					if(!angular.isUndefined(data.user.stats.animae_counter)) {
						$scope.totanimae = data.user.stats.animae_counter;
					}
					else {
						$scope.totanimae = 0;
					}
					if(!angular.isUndefined(data.user.stats.memos_counter)) {
						$scope.totmemo = data.user.stats.memos_counter;
					}
					else {
						$scope.totmemo = 0;
					}
				}
				else{
					$scope.totanimae = 0;
					$scope.totmemo = 0;
					$scope.totpoi = 0;
				}
				
				
				/*TAG LIST*/
				$scope.tags = data.user.tags;
				
				console.log(data);			
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});
                   
		
										
			Users.getAnimae(idUser)
			.success(function(data, status, headers, config){     			
				$scope.myData = data.animae;						
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});
				
				
			
			//get categories
			var categoryMap = [];
			Categories.get()
				.success(function(data, status, headers, config) {		
					
					data.categories.forEach(function(category, index, array) {
						categoryMap[category._id] = category.title;
					});
					
					
			});
			
			
			$scope.getCat = function(idCat) {
				return categoryMap[idCat];
			}
			
			
			var linkCellTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                       '  <a href="#/animae-free/{{row.entity._id}}">{{row.entity[col.field]}}</a>' +
                       '</div>';
            var dataTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">{{row.entity[col.field].slice(8,10)}}/{{row.entity[col.field].slice(5,7)}}/{{row.entity[col.field].slice(0,4)}}</div>'; 
                        
            var catTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">{{grid.appScope.getCat(row.entity[col.field])}}</div>'; 
         
                        
			$scope.gridOptions = { 
				data: 'myData',
				showGridFooter: true,
				enableSorting: false,
				columnDefs: [
					{field:'title', displayName:'Title', width:150, cellTemplate:linkCellTemplate}, 
					{field:'categoryId', displayName:'Category', cellTemplate:catTemplate}, 
				//	{field:'photo', displayName:'Photo'},
				//	{field:'poI', displayName:'POI', cellTemplate:poiTemplate},
					{field:'status', displayName:'Active'},
					{field:'stats.memos_counter', displayName:'Memo'},
					{field:'stats.accesses_counter', displayName:'Access'},
					{field:'lastAccess', displayName:'Last Access', cellTemplate:dataTemplate},
				]
			};
		
		
		
		$scope.delete = function() {
			if (confirm("Attention! \nYou are deleting the user. \nAre you sure?") == true) {
				
				Users.delete(idUser)
				.success(function(data, status, headers, config){
					
					$location.path("/users-standard");
				});			
			}
		};

		
		$scope.setPermission = function(permission) {
			if (confirm("Are you sure?") == true) {
				Users.setPermission(idUser, permission)	
				.success(function(data, status, headers, config){
					$scope.editor = true;	
				});	
			}
		}
		
		$scope.removePermission = function(permission) {
			if (confirm("Are you sure?") == true) {	
				Users.removePermission(idUser, permission)	
				.success(function(data, status, headers, config){
					$scope.editor = false;	
				});	
			}
		}
		
		
		/*TAG*/
		UsersTag.get()
			.success(function(data, status, headers, config){
				$scope.tagsList = data.tags;
			})
				
		
		$scope.addTagUser = function(objectTag) {
			
			var idTag = objectTag.originalObject._id;
			var dataUser = '["'+idUser+'"]';
						
			UsersTag.addUserTag(idTag, dataUser)
			.success(function(data, status, headers, config){	data		
				 //reload list of tag					 
				 var find = false;
				 angular.forEach($scope.tags, function(value, key) {					
					if(value._id == idTag){
						find = true;
					}			 
				 });
				 
				 if(find==false) {
					$scope.tags.push({_id: idTag, color: objectTag.originalObject.color, label: objectTag.originalObject.label});		
				 } 
			});	
		}
			
			
		$scope.deleteTagUser = function(idTag, index) {				
				
			ngDialog.openConfirm({
				template: 'deleteTagConfirm',
				className: 'ngdialog-theme-default'
			}).then(function () {		
				
				var dataUser = '["'+idUser+'"]';			
							
				UsersTag.removeUserTag(idTag, dataUser)
				.success(function(data, status, headers, config){
				
				 //reload list of tag	
				 $scope.tags.splice(index, 1);
				});	
				
			});
			
		};	
		
  	}]);

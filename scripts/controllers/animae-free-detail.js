'use strict';
angular.module('LetLifeBack')
	.controller('AnimaeDetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Animae', 'Users', 'Categories', 'Poi', 'Storage',
		function ($scope,    $rootScope,  $routeParams, Animae, Users, Categories, Poi, Storage) {
	
		
		var idAnima = $routeParams.animaId;	
		
		
		Animae.getDetail(idAnima)
			.success(function(data, status, headers, config){
				
				$scope.myData = data.anima.slots;
				
				if(!angular.isUndefined(data.anima.stats)) {
					if(!angular.isUndefined(data.anima.stats.accesses_counter)) {
						$scope.totaccess = data.anima.stats.accesses_counter;
					}
					else {
						$scope.totaccess = 0;
					}
					
					if(!angular.isUndefined(data.anima.stats.memos_counter)) {
						$scope.totmemo = data.anima.stats.memos_counter;
					}
					else {
						$scope.totmemo = 0;
					}
					
				}
				else{
					$scope.totaccess = 0;
					$scope.totmemo = 0;
				}
					
				if(!angular.isUndefined(data.anima.lastAccess)) {	
					var lastAcc = data.anima.lastAccess;
					$scope.last_access = lastAcc.slice(8,10)+"/"+lastAcc.slice(5,7)+"/"+lastAcc.slice(0,4);
					
					
				}
				else {
					$scope.last_access = "n/d";
				}
					
				$scope.name = data.anima.title;			
				var urlphoto = data.anima.photo;
				
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
				
					
				
				//get user
				Users.getDetail(data.anima.userId) 
					.success(function(data, status, headers, config) {
						$scope.username = data.user.email;
					})
					.error(function(data, status, headers, config){
						alert("Errore #" + status);
					});
				
				var categoryId = data.anima.categoryId;
				var poiId = data.anima.poI;
				
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
				
				//get Poi
				if(!angular.isUndefined(poiId)) {
					Poi.getDetail(poiId)
						.success(function(data, status, headers, config) {
							$scope.poi_address = data.poi.fullAddress;
							
					});
				}				
				
				console.log(data);			
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});
                 
        
        
			$scope.getData = function(data) {
				return  data + " -";
			}
			      
			
			var dataTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">{{row.entity[col.field].slice(8,10)}}/{{row.entity[col.field].slice(5,7)}}/{{row.entity[col.field].slice(0,4)}}</div>'; 
			
			var dataTemplate2 = '<div class="ngCellText" ng-class="col.colIndex()">{{grid.appScope.getData(row.entity[col.field])}}</div>'; 
        
			$scope.gridOptions = { 
				data: 'myData',
				showGridFooter: true,
				enableSorting: false,
				columnDefs: [
					{field:'title', displayName:'Name'}, 
					{field:'slotTypeId', displayName:'Slot Type'},
					{field:'suggested', displayName:'Suggested'},
					{field:'data.date', displayName:'Date'},
					{field:'lastModifyTime', displayName:'Last Modify', cellTemplate:dataTemplate}
				]
			};
		
  	}]);

'use strict';
angular.module('LetLifeBack')
	.controller('AnimaeCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Animae', 'Categories', 'uiGridConstants',
		function ($scope,    $rootScope,  $routeParams,   $location, Animae, Categories, uiGridConstants) {
				
			var categoryMap = [];
			var idCat = "";
			
			if(!angular.isUndefined($routeParams.categoryId)) {
				idCat = $routeParams.categoryId;
			}
			
		   //animae categories
		   Categories.get()
			.success(function(datacat, status, headers, config) {					
				
				datacat.categories.forEach(function(category, index, array) {
					categoryMap[category._id] = category.title;
				
					if(idCat != "") {					
						$scope.catid = true;
						$scope.category = categoryMap[idCat];
						
					}
				});
				
				Animae.getStats()
				.success(function(data, status, headers, config){
				console.log(data);
				$scope.totanimae = data.animae;
				
				var animaeMap = [];
				data.by_category.forEach(function(category, index, array) {
					animaeMap[category.categoryId] = category.count;
				});
				
				
					var i = 0;
					angular.forEach(categoryMap, function(value, key) {
						
						i = key+1;
						
						$scope["cat"+i] = categoryMap[i];
						
						if(!angular.isUndefined(animaeMap[i])) {
							$scope["animae"+i] = animaeMap[i];		
						}
						else {
							$scope["animae"+i] = 0;
						}
					});
				
				});
				
			})
			.error(function(data, status, headers, config){
				alert("Errore #" + status);
			});


			
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 50,
			sort: null
		  };
		  
		
			
			
			var linkCellTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                       '  <a href="#/animae-free/{{row.entity._id}}">{{row.entity[col.field]}}</a>' +
                       '</div>';
            
            var linkUserTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                       '  <a href="#/users-standard/{{row.entity.userId}}">{{row.entity[col.field]}}</a>' +
                       '</div>';
                   
            var dataTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">{{row.entity[col.field].slice(8,10)}}/{{row.entity[col.field].slice(5,7)}}/{{row.entity[col.field].slice(0,4)}}</div>';      
                       
			$scope.gridOptions = { 
				paginationPageSizes: [50, 75, 100],
				paginationPageSize: 50,
				useExternalPagination: true,
				useExternalSorting: true,
				showGridFooter: true,
				enableRowSelection: false,
				//enableSorting: false,
				columnDefs: [
					{field:'title', displayName:'Title', cellTemplate:linkCellTemplate}, 
					{field:'userFullName', displayName:'User', cellTemplate:linkUserTemplate, enableSorting: false}, 
					{field:'categoryName', displayName:'Category', enableSorting: false},
					//{field:'memos', displayName:'POI'},
					{field:'status', displayName:'Active'},
					{field:'stats.memos_counter', displayName:'Memo'},
					{field:'stats.accesses_counter', displayName:'Accesses'},			
					{field:'lastAccess', displayName:'Last Access', cellTemplate:dataTemplate}
				],
				onRegisterApi: function(gridApi) {
				  $scope.gridApi = gridApi;
				  gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					paginationOptions.pageNumber = newPage;
					paginationOptions.pageSize = pageSize;
					getPage(newPage, pageSize);
				  });
				  
				  $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
					  
					if (sortColumns.length == 0) {
					  paginationOptions.sort = null;
					} else {
					  paginationOptions.sort = sortColumns[0].sort.direction;
					  paginationOptions.name = sortColumns[0].name;
					}
					getPage(paginationOptions.pageNumber, paginationOptions.pageSize);
				  });
				}
			};
		
		var getPage = function(newPage, pageSize) {
				
				 var sorting = "";				
		 
				  switch(paginationOptions.sort) {

					  case uiGridConstants.ASC:
						sorting = paginationOptions.name;
						break;
					  case uiGridConstants.DESC:
						sorting = "-"+paginationOptions.name;
						break;
					  default:
						sorting = "-creationTime";
						break;
				  }
				
				
				if(idCat != "") {
					Animae.getFiltered(pageSize, newPage, idCat, sorting)			
					.success(function(data, status, headers, config){   
					  $scope.gridOptions.totalItems = data.total;
					  $scope.gridOptions.data = data.data;
					});
				}
				else {
					Animae.get(pageSize, newPage, sorting)			
					.success(function(data, status, headers, config){   
					  $scope.gridOptions.totalItems = data.total;
					  $scope.gridOptions.data = data.data;
					});
				}
			
			};
			  
		 getPage(1,50);
  	}]);


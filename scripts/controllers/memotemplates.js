'use strict';
angular.module('LetLifeBack')
	.controller('MemoCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'MemoTemplates', 'Categories', 'uiGridConstants',
		function ($scope,    $rootScope,  $routeParams,   $location, MemoTemplates, Categories, uiGridConstants) {
				
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
			
				
			//STATS			
			MemoTemplates.getStats()
			.success(function(data, status, headers, config){
				console.log(data);
				$scope.totalmemos = data.memosCreated;
				$scope.contentTypes = data.byContentType;
				
				
				var memosMap = [];
				data.byCategory.forEach(function(category, index, array) {
					memosMap[category.categoryId] = category.count;
				});
				
						var i = 0;
						
						angular.forEach(categoryMap, function(value, key) {
							
							i = key+1;
							$scope["cat"+i] = categoryMap[i];
							
							if(!angular.isUndefined(memosMap[i])) {
								$scope["animae"+i] = memosMap[i];		
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
				
	   
				
                   
		 
	   //LIST	  		  
	   var paginationOptions = {
			pageNumber: 1,
			pageSize: 50,
			sort: null
		  };	

		
			var linkCellTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                       '  <a href="#/memotemplate/detail/{{row.entity._id}}">{{row.entity[col.field]}}</a>' +
                       '</div>';

			var linkCelTemplateEdit = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                       '  <a href="#/memotemplate/edit/{{row.entity._id}}"><span class="fa fa-pencil-square-o"/></a>' +
                       '</div>';
                       
			$scope.gridOptions = { 
				paginationPageSizes: [50, 75, 100],
				paginationPageSize: 50,
				useExternalPagination: true,
				useExternalSorting: true,
				showGridFooter: true,
				enableRowSelection: false,
				//enableSorting: false,
				columnDefs: [
                    { field: 'edit', displayName: '', cellTemplate: linkCelTemplateEdit, width: 30 },
					{field:'title', displayName:'Title', cellTemplate:linkCellTemplate}, 
					{field:'categoryName', displayName:'Category', enableSorting: false}, 
					{field:'slotTypeId', displayName:'Slot Type'},
					{field:'triggerTypeId', displayName:'Trigger Type'},
					{field:'weight', displayName:'Popularity', enableSorting: false},
					{field:'userFullName', displayName:'Author', enableSorting: false},
					{field:'lastCall', displayName:'Last Call', enableSorting: false}
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
						sorting = "title";
						break;
				  }
				
				if(idCat != "") {
					 MemoTemplates.getFiltered(pageSize, newPage, idCat, sorting)			
					.success(function(data, status, headers, config){   
					  $scope.gridOptions.totalItems = data.total;
					  $scope.gridOptions.data = data.data;
					});
				}
				else {
					MemoTemplates.get(pageSize, newPage, sorting)			
					.success(function(data, status, headers, config){   
					  $scope.gridOptions.totalItems = data.total;
					  $scope.gridOptions.data = data.data;
					});
				}
			};
			  
		 getPage(1,50);
		
  	}]);

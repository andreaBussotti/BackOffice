'use strict';
angular.module('LetLifeBack')
	.controller('VendorsCtrl', ['$scope', '$rootScope', '$location', 'uiGridConstants', 'Vendors',
		function ($scope,    $rootScope,   $location, uiGridConstants, Vendors) {
				
	
		var paginationOptions = {
			pageNumber: 1,
			pageSize: 50,
			sort: null
		  };	
		
			
			
			var linkCellTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">' +
                       '  <a href="#/vendors/{{row.entity._id}}">{{row.entity[col.field]}}</a>' +
                       '</div>';
                     
			$scope.gridOptions = { 
				//data: 'myData',
				paginationPageSizes: [50, 75, 100],
				paginationPageSize: 50,
				useExternalPagination: true,
				useExternalSorting: true,
				showGridFooter: true,
				enableRowSelection: false,
				//enableSorting: false,
				columnDefs: [
					{field:'name', displayName:'Name', minWidth: 180, cellTemplate:linkCellTemplate}, 
					{field:'customDomain', displayName:'Domain', enableSorting: false}
					
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
						sorting = "name";
						break;
				  }
			
				
				Vendors.get(pageSize, newPage, sorting)			
				.success(function(data, status, headers, config){   
				  $scope.tot = data.total;
					
				  $scope.gridOptions.totalItems = data.total;
				  $scope.gridOptions.data = data.data;
				});
			
			};
			  
		 getPage(1,50);
  	}]);

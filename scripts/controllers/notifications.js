'use strict';
angular.module('LetLifeBack')
	.controller('NotificationCtrl', ['$scope', '$rootScope', '$location', 'Notifications', 'uiGridConstants',
		function ($scope,    $rootScope,   $location, Notifications, uiGridConstants) {
				
			
	   //STATS			
		Notifications.getStats()
		.success(function(data, status, headers, config){
				console.log(data);
				$scope.total = data.total;
				$scope.total_light = data.light;
				$scope.total_medium = data.medium;	
				$scope.total_strong = data.strong;
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
                       '  <a href="#/notification/detail/{{row.entity._id}}">{{row.entity[col.field]}}</a>' +
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
					{field:'target', displayName:'Target'}, 
					{field:'priority', displayName:'Priority*'},
					{field:'sendDate', displayName:'Send Date', cellTemplate:dataTemplate}
					
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
						sorting = "-sendDate";
						break;
				  }
				
				 Notifications.get(pageSize, newPage, sorting)			
				.success(function(data, status, headers, config){   
				  $scope.gridOptions.totalItems = data.total;
				  $scope.gridOptions.data = data.data;
				});
			
			};
			  
		 getPage(1,50);
  	}]);

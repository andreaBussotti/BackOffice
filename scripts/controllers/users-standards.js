'use strict';
angular.module('LetLifeBack')
	.controller('UsersCtrl', ['$scope', '$rootScope', '$location', 'uiGridConstants', 'UsersStats', 'Users',
		function ($scope,    $rootScope,   $location, uiGridConstants, UsersStats, Users) {

			UsersStats.get()
			.success(function(data, status, headers, config){
				console.log(data);
				$scope.totusers = data.registered;
				$scope.verifiedusers = data.verified;
				$scope.deletedusers = data.deleted;
				$scope.access = data.access_frequency;
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
                       '  <a href="#/users-standard/{{row.entity.id}}">{{row.entity[col.field]}}</a>' +
                       '</div>';

            var dataTemplate = '<div class="ui-grid-cell-contents" ng-class="col.colIndex()">{{row.entity[col.field].slice(8,10)}}/{{row.entity[col.field].slice(5,7)}}/{{row.entity[col.field].slice(0,4)}}</div>';

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
					{field:'username', displayName:'Username', minWidth: 180, cellTemplate:linkCellTemplate},
					{field:'first', displayName:'Name', width: 100},
					{field:'last', displayName:'Surname', width: 100},
					{field:'animae', displayName:'Animae', width: 75},
					{field:'memos', displayName:'Memos', width: 75},
					{field:'memotemplates', displayName:'Memo Templates', enableSorting: false},
					{field:'logins', displayName:'N. Access', width: 100},
					{field:'last_access', displayName:'Last Access', cellTemplate:dataTemplate},
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

				var mapFields = [];
				mapFields["username"] = "email";
				mapFields["first"] = "first";
				mapFields["last"] = "last";
				mapFields["last_access"] = "lastAccess";
				mapFields["animae"] = "stats.animae_counter";
				mapFields["memos"] = "stats.memos_counter";
				mapFields["logins"] = "stats.logins_counter";

				 var sorting = "";

				  switch(paginationOptions.sort) {

					  case uiGridConstants.ASC:
						sorting = mapFields[paginationOptions.name];
						break;
					  case uiGridConstants.DESC:
						sorting = "-"+mapFields[paginationOptions.name];
						break;
					  default:
						sorting = "-createdAt";
						break;
				  }

				var search = $scope.filterValue || null;

				Users.get(pageSize, newPage, sorting, search)
				.success(function(data, status, headers, config){
				  $scope.gridOptions.totalItems = data.total;
				  $scope.gridOptions.data = data.data;
				});

			};

		$scope.filter = function() {
			paginationOptions.pageNumber = 1;
			$scope.gridOptions.paginationCurrentPage = paginationOptions.pageNumber;
			getPage(paginationOptions.pageNumber, paginationOptions.pageSize);
		};

		 getPage(1,50);
  	}]);

'use strict';

angular.module('letlifeServices')
	.factory('Categories', ['$http', 'API', function ($http, API) {
    return {
        get : function() {        
            return $http.get(API.endpoint_public + '/categories');
		},
    };
}]);

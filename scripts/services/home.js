'use strict';

angular.module('letlifeServices')
	.factory('Login', ['$http', 'API', function ($http, API) {
    return {
        signup : function(data) {        
            return $http.post(API.endpoint + '/auth/token', data);
		},
    };
}]);

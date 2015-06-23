'use strict';

angular.module('letlifeServices')
	.factory('UsersStats', ['$http', 'API', function ($http, API) {
    return {
        get : function() {
            return $http.get(API.endpoint_version + '/stats/users');
        }
    };
}]);

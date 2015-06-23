'use strict';

angular.module('letlifeServices')
	.factory('Poi', ['$http', 'API', function ($http, API) {
    return {
        getDetail : function(idPoi) {        
            return $http.get(API.endpoint_version + '/pois/' + idPoi);     
		},
    };
}]);

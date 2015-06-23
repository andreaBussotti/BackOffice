'use strict';

angular.module('letlifeServices')
	.factory('Storage', ['$http', 'API', function ($http, API) {
    return {
        get : function(photo) {        
            return $http.get(API.endpoint_public + '/storage/presignedurl/read', {
				params: { key: photo }
			});
		},
    };
}]);

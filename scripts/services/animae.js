'use strict';

angular.module('letlifeServices')
	.factory('Animae', ['$http', 'API', function ($http, API) {
    return {
        getStats : function() {
            return $http.get(API.endpoint_version + '/stats/animae');
        },
        get : function(perpage, npage, sorting) {        
            return $http.get(API.endpoint_version + '/animae', {
				params: { page: npage, per_page: perpage, sorting: sorting }
			});
        }, 
        getFiltered: function(perpage, npage, cat, sorting) {        
            return $http.get(API.endpoint_version + '/animae', {
				params: { page: npage, per_page: perpage, categoryId: cat, sorting: sorting }
			});
        }, 
        getDetail : function(idAnima) {
			return $http.get(API.endpoint_version + '/animae/'+idAnima);
		}
    };
}]);

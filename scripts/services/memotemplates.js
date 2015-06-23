'use strict';

angular.module('letlifeServices')
	.factory('MemoTemplates', ['$http', 'API', function ($http, API) {
    return {
		get: function(perpage, npage, sorting) {
            return $http.get(API.endpoint_version + '/memotemplates', {
				params: { page: npage, per_page: perpage, sorting: sorting }
			});
		},
		getFiltered: function(perpage, npage, cat, sorting) {        
            return $http.get(API.endpoint_version + '/memotemplates', {
				params: { page: npage, per_page: perpage, categoryId: cat, sorting: sorting }
			});
        }, 
		getDetail : function(idMemo) {
			return $http.get(API.endpoint_version + '/memotemplates/'+idMemo);
		},
		post: function(data) {
		
			return $http.post(API.endpoint_version + '/memotemplates', data);
		},
        getSlotTypes : function() {
            return $http.get(API.endpoint_public + '/memo/slot/types');
		},
		getTriggerTypes: function() {
            return $http.get(API.endpoint_public + '/memo/trigger/types');
		},
		getStats: function() {
            return $http.get(API.endpoint_version + '/stats/memotemplates');
		}

    };
}]);

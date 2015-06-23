'use strict';

angular.module('letlifeServices')
	.factory('Vendors', ['$http', 'API', function ($http, API) {
    return {
        get : function(perpage, npage, sorting) {        
            return $http.get(API.endpoint_version + '/vendors', {
				params: { page: npage, per_page: perpage, sorting: sorting }
			});
        },        
        getDetail : function(idVendor) {
			return $http.get(API.endpoint_version + '/vendors/'+idVendor);
		},
		post: function(data) {	
			return $http.post(API.endpoint_version + '/vendors', data);
		},
		put: function(idVendor, data) {	
			return $http.put(API.endpoint_version + '/vendors/'+idVendor, data);
		},
		delete : function(idVendor) {
			return $http.delete(API.endpoint_version + '/vendors/'+idVendor);
		},
		getUsers: function(idVendor) {
			return $http.get(API.endpoint_version + '/vendors/'+idVendor+"/users");
		},		
		addUsers: function(idVendor, dataUser) {
			return $http({ method: 'PATCH', url: API.endpoint_version + '/vendors/'+idVendor+'/push', data: '{ "users": '+dataUser+'}'});
		},
		removeUsers: function(idVendor, dataUser) {
			return $http({ method: 'PATCH', url: API.endpoint_version + '/vendors/'+idVendor+'/pull', data: '{ "users": '+dataUser+'}'});
		}
		
    };
}]);

'use strict';

angular.module('letlifeServices')
	.factory('Users', ['$http', 'API', function ($http, API) {
    return {
        get : function(perpage, npage, sorting, search) {
            return $http.get(API.endpoint_version + '/users', {
				params: { page: npage, per_page: perpage, sorting: sorting, search:search }
			});
        },
        getDetail : function(idUser) {
			return $http.get(API.endpoint_version + '/users/'+idUser);
		},
		getAnimae : function(idUser) {
			return $http.get(API.endpoint_version + '/users/'+idUser+"/animae");
		},
		delete : function(idUser) {
			return $http.delete(API.endpoint_version + '/users/'+idUser);
		},
		setPermission: function(idUser, permission) {
			//return $http.patch(API.endpoint_version + '/users/'+idUser+"/approve/"+permission);
			return $http({ method: 'PATCH', url: API.endpoint_version + '/users/'+idUser+"/approve/"+permission });
		},
		removePermission: function(idUser, permission) {
			//return $http.patch(API.endpoint_version + '/users/'+idUser+"/revoke/"+permission);
			return $http({ method: 'PATCH', url: API.endpoint_version + '/users/'+idUser+"/revoke/"+permission });
		},
		post: function(data) {
			return $http.post(API.endpoint_version + '/users', data);
		},
		getByAuthToken: function() {
			return $http.get(API.endpoint_public + '/user');
		}
    };
}]);

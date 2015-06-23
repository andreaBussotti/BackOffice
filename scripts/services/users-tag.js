'use strict';

angular.module('letlifeServices')
	.factory('UsersTag', ['$http', 'API', function ($http, API) {
    return {
        get : function() {
			return $http.get(API.endpoint_version + '/user/tags');
		},   
		getDetail : function(idTag) {
			return $http.get(API.endpoint_version + '/user/tags/'+idTag);
		}, 
		post: function(data) {	
			return $http.post(API.endpoint_version + '/user/tags', data);
		},
		put: function(idTag, data) {	
			return $http.put(API.endpoint_version + '/user/tags/'+idTag, data);
		},
		delete: function(idTag) {
			return $http.delete(API.endpoint_version + '/user/tags/'+idTag);
		}, 	
		getUsersTag: function(idTag) {
			return $http.get(API.endpoint_version + '/user/tags/'+idTag+"/all");
		} ,
		
		removeUserTag: function(idTag, dataUser) {
			return $http({ method: 'PATCH', url: API.endpoint_version + '/user/tags/'+idTag+'/pull', data: '{ "users": '+dataUser+'}'});
		},
		addUserTag: function(idTag, dataUser) {
			return $http({ method: 'PATCH', url: API.endpoint_version + '/user/tags/'+idTag+'/push', data: '{ "users": '+dataUser+'}'});
		}
		
        
		
    };
}]);

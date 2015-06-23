'use strict';

angular.module('letlifeServices')
	.factory('Notifications', ['$http', 'API', function ($http, API) {
    return {
		get: function(perpage, npage, sorting) {
            return $http.get(API.endpoint_version + '/messages', {
				params: { page: npage, per_page: perpage, sorting: sorting }
			});
		},
		getDetail : function(idNotification) {
			return $http.get(API.endpoint_version + '/messages/'+idNotification);
		},
		getStats : function() {
			return $http.get(API.endpoint_version + '/stats/messages');
		},
		post: function(data) {
		
			return $http.post(API.endpoint_version + '/messages', data);
		}

    };
}]);

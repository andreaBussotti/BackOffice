'use strict';
angular.module('LocalStorageModule').value('prefix', 'letlife');
angular.module('LetLifeBack', ['ngRoute', 'letlifeServices', 'LocalStorageModule','ui.grid', 'ui.grid.resizeColumns', 'ui.grid.pagination', 'ngDialog', 'angucomplete'])
 	.constant('API', {

 		//endpoint_version : 'http://api.let.life:9000/v1/admin',
 		endpoint_version : 'http://54.77.137.107:9200/v1/admin',
 		//endpoint_version : 'https://api-ssl2.let.life/v1/admin',

 		//endpoint_public : 'http://api.let.life:9000/v1',
 		endpoint_public : 'http://54.77.137.107:9200/v1',
 		//endpoint_public : 'https://api-ssl2.let.life/v1',
		//
		//endpoint : 'http://api.let.life:9000',
		endpoint : 'http://54.77.137.107:9200',
		//endpoint : 'https://api-ssl2.let.life',

		urlFrontend : 'http://test.let.life/',
		authBasic : 'dGVzdC1vYXV0aC1jbGllbnQ6dGVzdC1vYXV0aC1jbGllbnQ='

 	})
  /**
   * CONFIGURAZIONE
   * ROUTER
   */

	.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.post = { 'Content-Type': 'application/json' };
	$httpProvider.interceptors.push('myHttpInterceptor');

  	$routeProvider
    	.when('/', {
          templateUrl: 'views/index.html',
          controller: 'IndexCtrl'
        })
        .when('/home', {
          templateUrl: 'views/home/login.html',
          controller: 'LoginCtrl'
        })
        .when('/vendors', {
          templateUrl: 'views/vendors/vendors-all.html',
          controller: 'VendorsCtrl'
        })
        .when('/vendors/create', {
          templateUrl: 'views/vendors/vendors-creation.html',
          controller: 'VendorsCreateCtrl'
        })
        .when('/vendors/:vendorId', {
          templateUrl: 'views/vendors/vendors-detail.html',
          controller: 'VendorsDetailCtrl'
        })
        .when('/users-standard', {
          templateUrl: 'views/users/standard-all.html',
          controller: 'UsersCtrl'
        })
        .when('/users-standard/create', {
          templateUrl: 'views/users/user-creation.html',
          controller: 'UsersCreateCtrl'
        })
        .when('/users-standard/tag-editor', {
          templateUrl: 'views/users/tag-editor.html',
          controller: 'UsersTagCtrl'
        })
        .when('/users-standard/:userId', {
          templateUrl: 'views/users/standard-detail.html',
          controller: 'UsersDetailCtrl'
        })
        .when('/animae-free', {
          templateUrl: 'views/animae/free.html',
          controller: 'AnimaeCtrl'
        })
        .when('/animae-free/category/:categoryId', {
          templateUrl: 'views/animae/free.html',
          controller: 'AnimaeCtrl'
        })
        .when('/animae-free/:animaId', {
          templateUrl: 'views/animae/free-detail.html',
          controller: 'AnimaeDetailCtrl'
        })
        .when('/animae-memo/:memoId', {
          templateUrl: 'views/animae/free-detail-memo.html',
          controller: 'MemoDetailCtrl'
        })
        .when('/notification', {
          templateUrl: 'views/notification/all.html',
          controller: 'NotificationCtrl'
        })
        .when('/notification/create', {
          templateUrl: 'views/notification/creation.html',
          controller: 'NotificationCreateCtrl'
        })
       .when('/notification/detail/:notificationId', {
          templateUrl: 'views/notification/detail.html',
          controller: 'NotificationDetailCtrl'
        })
        .when('/memotemplate', {
          templateUrl: 'views/memo/template-all.html',
          controller: 'MemoCtrl'
        })
        .when('/memotemplate/category/:categoryId', {
          templateUrl: 'views/memo/template-all.html',
          controller: 'MemoCtrl'
        })
        .when('/memotemplate/create', {
          templateUrl: 'views/memo/template-creation.html',
          controller: 'MemoCreateCtrl'
        })
        .when('/memotemplate/detail/:memotemplateId', {
          templateUrl: 'views/memo/template-detail.html',
          controller: 'MemoDetailCtrl'
        })
        .when('/memotemplate/edit/:memotemplateId', {
            templateUrl: 'views/memo/template-edit.html',
            controller: 'MemoEditCtrl'
        })

        .when('/memotemplate/suggestion', {
          templateUrl: 'views/memo/suggestion-creation.html',
          controller: 'NotificationCtrl'
        })
        .otherwise({
      		redirectTo: '/home'
    		});



	}])


	.factory('myHttpInterceptor', ['$q', '$rootScope', '$location', 'API', function($q, $rootScope, $location, API) {
    return {
      // add user token to $http request
      'request': function(config) {
         if ($rootScope.user) {
			config.headers.Authorization = 'Bearer '+$rootScope.user;
         }
         else {
			config.headers.Authorization = 'Basic ' + API.authBasic;
		 }

        return config;
      },

      //error 401 redirect to login
     'responseError': function(rejection) {
        if(rejection.status === 401) {
            // you are not autorized
            window.location.href="#/home";
          }
          return $q.reject(rejection);

        /*
        if (canRecover(rejection)) {
          return responseOrNewPromise
        }
        return $q.reject(rejection);

        */
      }


    };
}])

	.run(['$rootScope', '$location', '$http', 'localStorageService','API', 'Users',
    function($rootScope, $location, $httpProvider, localStorageService, API, Users){


    $rootScope.$on('login', function(event, token){

        localStorageService.set("user", token);
        $rootScope.user = token;


		//check user permission
		Users.getByAuthToken()
		.success(function(data, status, headers, config){

			if(data.user.permissions.length === 0) {
				window.location.href=API.urlFrontend;
			}
			else {			



				localStorageService.set("user-permission", data.user.permissions);
				
				//if user-permission == brand.manager, save the vendor
				if(data.user.permissions.indexOf("brand.manager") != -1) {
					
					//TODO: if data.user.vendors.length>1
					if(data.user.vendors != "") {				
						localStorageService.set("user-vendor", data.user.vendors[0]);
					}
				}			
				

				//window.location.href="#/";
				window.location.reload();
				
			}
		})
		.error(function(data, status, headers, config){
			$scope.error = true;
		});


      });



      $rootScope.logout = function(){

		window.location.href="#/home";

		localStorageService.remove("user");
        localStorageService.remove("user-permission");
        localStorageService.remove("user-vendor");
        delete $rootScope.user;

      };


      if(localStorageService.get("user")){
        $rootScope.user = localStorageService.get("user"); 
       // $rootScope.$emit("login", $rootScope.user);
        
        //window.location.href="#/";
        $location.path( "/" );
      }
      else {
		  $location.path( "#/home" );
	  }


    }
  ]);

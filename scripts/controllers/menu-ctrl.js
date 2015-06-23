'use strict';
angular.module('LetLifeBack')
	
	.directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    })
	
	.controller('menuCtrl', ['$scope', '$rootScope', '$location', 'localStorageService', '$http',
		function ($scope,    $rootScope,   $location, localStorageService, $http) {

		//permissions: letlife.editor / brand.manager
		var menuNav = "";
	
		if(localStorageService.get("user-permission").indexOf("letlife.editor") != -1) {
			
			$http.get('views/menu/menu-editor.json').success(function(data) {
				$scope.menuNav = data;			
		    });

		}
		else if(localStorageService.get("user-permission").indexOf("brand.manager") != -1) {
			$http.get('views/menu/menu-brand.json').success(function(data) {
				$scope.menuNav = data;						
		    });
		}
		
		 $scope.$on('onRepeatLast', function(scope, element, attrs){
			$('#side-menu').metisMenu();
		 });

		
  	}]);

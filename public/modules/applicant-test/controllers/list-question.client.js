'use strict';

angular.module('applicant-test').controller('ApplicantTestController', ['$scope', '$stateParams', '$location', 'Authentication', 'Questions', '$http',
    function($scope, $stateParams, $location, Authentication, Questions, $http ) {
        
        $scope.authentication =Authentication;

        $scope.find = function(){
    	     var url = '/test/';
          $http.get(url).success(function(response) {
              $scope.questions = response;
              console.log('Questions init');
              console.log($scope.questions);
          });
        };
    }
]);
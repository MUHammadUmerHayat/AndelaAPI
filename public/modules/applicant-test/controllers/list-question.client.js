'use strict';

angular.module('applicant-test').controller('ApplicantTestController', ['$scope', '$stateParams', '$location', 'Authentication', 'Questions', '$http',
    function($scope, $stateParams, $location, Authentication, Questions, $http) {

        $scope.authentication = Authentication;

        $scope.find = function() {
            $http.get('/test/').success(function(response) {
                $scope.questions = response;
            });
        };
    }
]);

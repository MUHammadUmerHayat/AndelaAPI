'use strict';

// Instructors controller
angular.module('instructors').controller('InstructorsController', ['$scope', '$rootScope', '$upload', '$stateParams', '$location', 'Authentication', '$http',
    function($scope, $rootScope, $upload, $stateParams, $location, Authentication, $http) {
        $scope.user = Authentication.user;

        // instructor sigin 
        $scope.instructor_signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.user = response;

                // And redirect to the right page
                if ($scope.user.role === 'instructor') {
                    $location.path('/instructors/home');    
                }
                else{
                    $location.path('/');
                }
            }).error(function(response) {
                $scope.error = response.message;
                $location.path('/');
            });
        };

        
        // instructor's home page
        $scope.instructorHome = function(){
            if (!$scope.user) {
                $location.path('/');
            }
        };


        // list all bootcamps
        $scope.listBootcamps = function() {
            $http.get('/instructor/bootcamps').success(function(response) {
                $scope.success = true;
                $scope.bootcamps = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };


        // viewing only a particular bootcamp
        $scope.viewBootcamp = function() {
            if ($stateParams.bootcampId.length < 20) {
                $location.path('/');
            }else{
                $http.get('/instructor/camp/' + $stateParams.bootcampId).success(function(response) {
                    $scope.success = true;
                    $scope.bootcamp = response;
                    $scope.applicants = $scope.bootcamp.applicants;
                }).error(function(response) {
                    $scope.error = response.message;
                }); 
            }
        };



        // list all trainees
        $scope.listTrainees = function() {
            $http.get('/instructor/trainees').success(function(response) {
                $scope.success = true;
                $scope.trainees = response;                                                                     
          }).error(function(response) {
            $scope.error = response.message;
            });
        };

        
        // view a particular trainee        
        $rootScope.viewTrainee = function() {
            if ($stateParams.applicantId.length < 20) {
                $location.path('/');
            }else{
                $rootScope.traineeId = $stateParams.applicantId;
                $http.get('/instructor/trainee/' + $rootScope.traineeId).success(function(response) {
                    $scope.success = true;
                    $rootScope.trainee = response;
                    $rootScope.assessments = $rootScope.trainee.assessments;            
                    angular.forEach($rootScope.trainee.assessments, function(assessment, key){
                        $rootScope.assessment = assessment; 
                    });
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        };


        // list all fellows
        $scope.listFellows = function() {
            $http.get('/instructor/fellows').success(function(response) {
                $scope.success = true;
                $scope.fellows = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        
        // view a particular fellow
        $scope.viewFellow = function() {
            if ($stateParams.fellowId.length < 20) {
                $location.path('/');
            }else {
                $http.get('/instructor/trainee/' + $stateParams.fellowId).success(function(response) {
                    $scope.success = true;
                    $scope.fellow = response;
                    angular.forEach($scope.fellow.skillSets, function(skillSets, key){
                        $scope.skillSets = skillSets;  
                    });     
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        };
    }   
]);


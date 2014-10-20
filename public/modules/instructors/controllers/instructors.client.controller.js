'use strict';

// Instructors controller
angular.module('instructors').controller('InstructorsController', ['$scope', 'Assessment', 'Camp', '$upload', '$stateParams', '$location', 'Authentication', '$http',
    function($scope, Assessment, Camp, $upload, $stateParams, $location, Authentication, $http) {
        $scope.user = Authentication.user;

        // instructor signin 
        $scope.instructor_signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.user = response;

                // And redirect to the right page
                if ($scope.user.role === 'instructor') {
                    $location.path('/instructors/home');
                } else {
                    $location.path('/');
                }
            }).error(function(response) {
                $scope.error = response.message;
                $location.path('/');
            });
        };

        // instructor's home page
        $scope.instructorHome = function() {
            if (!$scope.user) {
                $location.path('/');
            }
        };

        // list all bootcamps
        $scope.listBootcamps = function() {
            Camp.query(function success(response) {
                    $scope.success = true;
                    $scope.bootcamps = response;
                    $scope.traineeCountArr = [];

                    for (var i in $scope.bootcamps) {
                        var traineeCount = 0;

                        for (var j in $scope.bootcamps[i].applicants) {
                            if ($scope.bootcamps[i].applicants[j].role === 'trainee') {
                                traineeCount += 1;
                            }
                        }
                        $scope.traineeCountArr.push(traineeCount);
                    }
                },
                function(error) {
                    $scope.error = error.message;
                });
        };

        // viewing only a particular bootcamp
        $scope.viewBootcamp = function() {
            $scope.error = false;
            if ($stateParams.bootcampId.length === 0) {
                $scope.error = true;
            } else {
                Camp.get({
                        campId: $stateParams.bootcampId
                    },
                    function success(response) {
                        $scope.bootcamp = response;
                        $scope.applicants = $scope.bootcamp.applicants;
                    },
                    function(error) {
                        $scope.error = true;
                    }
                );
            }
        };

        // filter to get only trainees
        $scope.onlyTrainees = function(applicant) {
            return applicant.role === 'trainee';
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
        $scope.viewTrainee = function() {
            if ($stateParams.applicantId === "") {
                $scope.error = true;
            } else {
                Assessment.get({
                        traineeId: $stateParams.applicantId
                    },
                    function success(response) {
                        $scope.success = true;
                        $scope.error = false;
                        $scope.trainee = response;
                        $scope.assessments = $scope.trainee.assessments;
                    },
                    function(error) {
                        $scope.error = true;
                    }
                );
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
            } else {
                $http.get('/instructor/trainee/' + $stateParams.fellowId).success(function(response) {
                    $scope.success = true;
                    $scope.fellow = response;
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        };

        // show instructor profile picture
        $scope.showImage = function(img) {
            if (img) {
                img = img.substring(6);
                return img;
            } else {
                return 'http://www.localcrimenews.com/wp-content/uploads/2013/07/default-user-icon-profile.png';
            }
        };

        // get assessment
        $scope.getAssessment = function() {
            $scope.error = false;
            Assessment.get({
                    traineeId: $stateParams.applicantId,
                    assmtId: $stateParams.assessmentId
                },
                function success(response) {
                    if (response._id) {
                        $scope.assessment = response;
                        var date = new Date($scope.assessment.assessment_date),
                            year = date.getFullYear(),
                            month = date.getMonth(),
                            day = date.getDate();

                        //month 2 digits
                        month = ("0" + (month + 1)).slice(-2);

                        //year 2 digits
                        year = year.toString().substr(2, 2);

                        $scope.assessment.assessment_date = month + '/' + day + "/" + year;
                    } else {
                        $scope.error = true;
                    }
                },
                function(error) {
                    $scope.error = true;
                }
            );
        };
    }
]);

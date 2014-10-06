'use strict';

angular.module('applicant').controller('ApplicantController', ['$scope', '$upload', '$http', 'Authentication', '$stateParams', '$location', 'Applicants', 'Users', 'Bootcamps', 'Questions',
    function($scope, $upload, $http, Authentication, $stateParams, $location, Applicants, Users, Bootcamps, Questions) {
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        $scope.isClicked = false;

        $scope.clicked = function() {
            $scope.isClicked = true;
            $scope.showLoader = true;
            $scope.signup();
        };

        $scope.findCamp = function() {
            $scope.result;
            Bootcamps.query().$promise.then(

                function(value) {
                    $scope.camp = value[0]._id;
                },

                function(err) {
                    return err;
                }
            );
        };

        $scope.field = 1;
        $scope.username = '';
        $scope.password1 = '';
        $scope.cpassword1 = '';
        $scope.state = false;

        $scope.show_next = function(value) {
            if (value < 4) {
                $scope.field++;
                $scope.result = [$scope.username, $scope.password1, $scope.cpassword1, $scope.gender];
                if (value === 4) {
                    math.ceil
                }
            }
        };

        $scope.show_prev = function(value) {
            if (value > 1) {
                $scope.field--;
            }
        };

        $scope.findOneQuestion = function() {
            Questions.query().$promise.then(
                function(response) {
                    $scope.questions = response[0];
                },
                function(err) {
                    return err;
                });
        };

        $scope.options = [];
        $scope.assess = function(test, option) {
            if ($scope.options.length === 0) {
                $scope.options.push({
                    question: test,
                    answer: option
                });
            } else {
                for (var i = 0; i < $scope.options.length; i++) {
                    if (test === $scope.options[i].question) {
                        $scope.options[i].answer = option;
                    } else {
                        $scope.options.push({
                            question: test,
                            answer: option
                        });
                    }
                };
            };
        };

        // cv upload
        $scope.onFileSelect = function($files) {
            $scope.files = $files;
            if ($scope.files) {
                if ($scope.files[0].type === 'application/pdf' || $scope.files[0].type === 'application/msword' || $scope.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    $scope.correctFormat = true;
                } else {
                    $scope.correctFormat = false;
                }
            }
        };

        $scope.correctAnswers = 0;

        $scope.signup = function() {
            var user = new Users($scope.user);

            for (var i in $scope.questions.questions) {
                var choices = $scope.questions.questions[i].questOptions;

                for (var j in choices) {
                    if (choices[j]._id === $scope.options[i].answer && choices[j].answer === true) {
                        $scope.correctAnswers += 1;
                        break;
                    };
                };
            };

            $scope.testScore = Math.round(($scope.correctAnswers / $scope.questions.questions.length) * 100);

            $scope.user.type = 'applicant';
            $scope.user.testScore = $scope.testScore;

            $scope.upload = $upload.upload({
                    url: '/auth/' + $scope.camp + '/signup',
                    method: 'Post',
                    data: $scope.user,
                    file: $scope.files[0]
                })
                .success(function(response) {
                    $scope.logId = response;
                    $scope.authentication.user = response;
                    $location.path('/successpage');
                })
                .error(function(err) {});

        };

        $scope.findOne = function() {
            Applicants.get({
                applicantId: $stateParams.applicantId
            }).$promise.then(function(response) {
                $scope.applicant = response;
            }, function(err) {
                $scope.error = err.message;
                $location.path('/');

            });
        };

        $scope.show_profile = function() {

            var url = '/users/' + $stateParams.logged_inId;

            $http.get(url).success(function(response) {
                $scope.user_profile = response;
            }).error(function(response) {
                $scope.error = response.message;
                $http.get('/auth/signout');
                $location.path('/errorpage');

            });
        };
    }
]);

angular.module('applicant').directive('ngConfirmField', function() {
    return {
        require: 'ngModel',
        scope: {
            confirmAgainst: '=',
        },
        link: function(scope, iElement, iAttrs, ngModelCtrl) {

            var updateValidity = function() {
                var viewValue = ngModelCtrl.$viewValue;
                var isValid = isFieldValid();
                if (ngModelCtrl.$viewValue)
                    ngModelCtrl.$setValidity('noMatch', isValid);
                // If the field is not valid, return undefined.
                return isValid ? viewValue : undefined;
            };

            // Test the confirm field view value matches the confirm against value.
            var isFieldValid = function() {
                return ngModelCtrl.$viewValue === scope.confirmAgainst;
            };

            // Convert data from view format to model format
            ngModelCtrl.$parsers.push(updateValidity);

            // Watch for changes in the confirmAgainst model.
            scope.$watch('confirmAgainst', updateValidity);
        }
    };
});

angular.module('applicant').directive('ensureUnique', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c, ngModel) {
            attrs.$observe('ngModel', function(value) {
                scope.$watch(value, function(newValue) {
                    $http({
                        method: 'POST',
                        url: '/users/check/uniqueUsername',
                        data: {
                            'username': newValue
                        }
                    }).success(function(data, status, headers, cfg) {
                        if (data.length > 0) {
                            c.$setValidity('unique', false);
                        } else {
                            c.$setValidity('unique', true);
                        }
                    }).error(function(data, status, headers, cfg) {
                        c.$setValidity('unique', true);
                    });
                });
            });
        }
    }
}]);

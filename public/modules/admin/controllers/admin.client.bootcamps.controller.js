'use strict';

// Lists controller
angular.module('admin').controller('BootcampsController', ['$scope', '$http', 'Authentication', '$stateParams', '$location', '$modal', '$log', 'Bootcamp',
    function($scope, $http, Authentication, $stateParams, $location, $modal, $log, Bootcamp) {

        $scope.user = Authentication.user;

        // Create Bootcamp
        $scope.createCamp = function() {
            var bootcamp = new Bootcamp($scope.credentials);
            bootcamp.$save(function success(response) {
                $location.path('/admin/camps');
            }, function(error) {
                if (error) {
                    $scope.error = 'Something went wrong. Please try again and check your input';
                }
            });
        };

        // View a particular Bootcamp
        $scope.viewcamp = function() {
            Bootcamp.get({
                campId: $stateParams.campId
            }, function success(response) {
                $scope.camp = response;
                $scope.editorEnabled = false;
            }, function(error) {
                $scope.error = error.message;
            });
        };

        // List all Bootcamps
        $scope.listcamps = function() {
            Bootcamp.query(function success(response) {
                $scope.camps = response;
                for (var i = 0; i < response.length; i++) {
                    $scope.camp_options.push(response[i].camp_name);
                }
            }, function(error) {
                $scope.error = error.data.message;
                $location.path('/admin/welcome');
            });
        };


        $scope.deleteCamp = function(camp, index) {
            $scope.camps.splice(index, 1);
            camp.$remove(function success(response) {}, function(error) {
                $scope.error = error.data.message;
            });
        };

        $scope.enableApplicantEditor = function(index) {
            $scope.editorEnabled = true;
            $scope.formData.editableFirstName = $scope.camp.applicants[index].firstName;
            $scope.formData.editableLastName = $scope.camp.applicants[index].lastName;
            $scope.formData.editableEmail = $scope.camp.applicants[index].email;
        };

        $scope.disableApplicantEditor = function() {
            $scope.editorEnabled = false;
        };

        $scope.saveApplicant = function(index) {
            $scope.camp.applicants[index].firstName = $scope.formData.editableFirstName;
            $scope.camp.applicants[index].lastName = $scope.formData.editableLastName;
            $scope.camp.applicants[index].email = $scope.formData.editableEmail;

            var url = 'users/' + $scope.camp.applicants[index]._id;
            var data = {
                firstName: $scope.formData.editableFirstName,
                lastName: $scope.formData.editableLastName,
                email: $scope.formData.editableEmail
            };
            $http.put(url, data).success(function(response) {}).error(function(response) {
                $scope.error = response.message;
            });
            $scope.disableApplicantEditor();
        };

        $scope.changeApplicantStatusInline = function(apptId, index) {
            if ($scope.data.status.name === 'fellow') {
                $http.put('/admin/applicant/' + apptId + '/role', {
                    role: 'fellow'
                }).success(function(response) {
                    // If successful show success message and clear form
                    $scope.camp.applicants[index].status.name = 'Andela Fellow';
                }).error(function(response) {
                    $scope.error = response.message;
                });
            } else {
                $http.put('/admin/applicant/' + apptId + '/status', $scope.data).success(function(response) {
                    // If successful show success message and clear form
                    $scope.camp.applicants[index].status.name = $scope.data.status.name;
                    $scope.camp.applicants[index].status.reason = $scope.data.status.reason;
                    $scope.data.status.name = '';
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        };
    }
]);

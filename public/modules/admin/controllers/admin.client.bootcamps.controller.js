
'use strict';

// Lists controller
angular.module('admin').controller('BootcampsController', ['$scope', '$http', 'Authentication', '$stateParams', '$location', '$modal', '$log', 'Bootcamps',
    function($scope, $http, Authentication, $stateParams, $location, $modal, $log, Bootcamps){

        $scope.user = Authentication.user;


        // Create Bootcamp
        $scope.createCamp = function() {
            $http.post('/admin/camp', $scope.credentials).success(function(response){
                $location.path('/admin/camps');
            }).error(function(response) {
                $scope.error = response.message;
                if ($scope.error.type === 'date'){
                    $scope.error = 'Please follow the date pattern specified M/D/YY e.g (use 2/5/2014 for 5th Feb 2014)';
                }
            });
        };

        // View a particular Bootcamp
        $scope.viewcamp = function() {
            $http.get('/admin/camp/' + $stateParams.campId).success(function(response) {
              $scope.camp = response;
              $scope.editorEnabled = false;
            }).error(function(response) {
                $scope.error = response.message;

            });

        };

        // List all Bootcamps
        $scope.listcamps = function() {
            $http.get('/admin/camp').success(function(response) {
                $scope.camps = response;
                for(var i = 0; i < response.length; i++){
                    $scope.camp_options.push(response[i].camp_name);
                }
            }).error(function(response) {
                $scope.error = response.message;
                $location.path('/admin/welcome');

            });
        };


        $scope.deleteCamp = function(campId, index) {
          $scope.camps.splice(index, 1);
          $http.delete('/admin/camp/' + campId).success(function(response) {
          }).error(function(response) {
            $scope.error = response.message;
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
            $http.put(url, data).success(function(response){
            }).error(function(response) {
                $scope.error = response.message;
            });
            $scope.disableApplicantEditor();
        };

        $scope.changeApplicantStatusInline = function(apptId, index){
            if($scope.data.status.name === 'fellow'){
                $http.put('/admin/applicant/' + apptId + '/role', {role: 'fellow'}).success(function(response) {
                    // If successful show success message and clear form
                    $scope.camp.applicants[index].status.name = 'Andela Fellow';
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
            else{
                $http.put('/admin/applicant/' + apptId, $scope.data).success(function(response) {
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
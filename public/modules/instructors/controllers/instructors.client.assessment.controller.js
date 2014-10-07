'use strict';

angular.module('instructors').controller('AssessmentController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Assessment', '$http',
    function($scope, $rootScope, $stateParams, $location, Authentication, Assessment, $http) {
    
        // create assessment record
        $scope.createAssessment = function() {
        
            // create new assessment for trainee 
            var assmntObject = ({
                traineeId: $stateParams.applicantId,
                assessment_name: $scope.assessment_name,
                assessment_date: $scope.dt,
                score: $scope.score
            });

            var assessment = new Assessment(assmntObject);
            assessment.$save(function success(response) {
                $location.path('/instructors/trainees/' + $stateParams.applicantId);
            },  function (error) {
                    $scope.error = error.data.message;
                }
            );
        };
  
        // edit trainee assessment record
        $scope.updateAssessment = function() {
            var assessment = new Assessment($scope.assessment);
            assessment.traineeId = $scope.assessment.applicantId; 

            assessment.$update(function success(response) {
                $location.path('/instructors/trainees/' + $stateParams.applicantId);
            },  function (error) {
                    $scope.error = error.message;
                }
            );
        };

        // delete trainee assessment record
        $scope.deleteAssessment = function(index, assessment) {
            $scope.assessments.splice(index, 1);
            var assessment = new Assessment(assessment);
            assessment.traineeId = assessment.applicantId;

            assessment.$remove(function success(response) {
                $scope.success = true;
            },  function (error) {
                    $scope.error = error.message;
                }
            ); 
        };

        $scope.today = function() {
            $scope.dt = new Date();
        };
        
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
          
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'longDate'];
        $scope.format = $scope.formats[4];
    }
]);
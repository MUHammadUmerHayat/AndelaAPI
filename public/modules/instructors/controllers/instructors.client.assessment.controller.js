'use strict';

angular.module('instructors').controller('AssessmentController', ['$scope', '$stateParams', '$location', 'Authentication', 'Assessment', '$http',
    function($scope, $stateParams, $location, Authentication, Assessment, $http) {
        
        $scope.editStates = [];
        var date = new Date(),
            year = date.getFullYear(),
           month = date.getMonth(),
             day = date.getDate();

        // month 2 digits
        month = ("0" + (month + 1)).slice(-2);

        // year 2 digits
        year = year.toString().substr(2,2);

        var formattedDate = month + '/' + day+ "/" + year;
        $scope.date =  formattedDate; 

        $scope.initEditStates = function() {
            for (var i in $scope.assessments) {
                $scope.editStates[i] = false;
            }
        };

        $scope.initEditStates();
        $scope.models = [];

        // create assessment record
        $scope.createAssessment = function() {
        
            // create new assessment for trainee 
            var assmntObject = ({
                traineeId: $stateParams.applicantId,
                assessment_name: $scope.assessment_name,
                assessment_date: $scope.date,
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
        $scope.updateAssessment = function(index, assessment, model) { 
            var assessment = new Assessment(assessment);
            assessment.traineeId = assessment.applicantId;
            if (typeof model.newScore !== 'undefined') {
                if (model.newScore.length!== 0) {
                    assessment.score =  model.newScore;
                }
            }

            if (typeof model.newName !== 'undefined') {
                if (model.newName.length!== 0) {
                    assessment.assessment_name =  model.newName;
                }
            }

            if (typeof model.newDate !== 'undefined') {
                if (model.newDate.length!== 0) {
                    var pattern = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(199\d|[2-9]\d{3})$/;
                    if (pattern.test(model.newDate) === true) {
                        assessment.assessment_date =  model.newDate;
                    } else {
                        alert('Date format should be MM/dd/yyyy');
                        return ;
                    }
                }
            }

            assessment.$update(function success(response) {
                $scope.editStates[index] = false;
                $scope.assessments = response.assessments;
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
    }
]);

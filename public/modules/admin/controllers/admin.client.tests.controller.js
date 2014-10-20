
'use strict';

// Lists controller
angular.module('admin').controller('TestsController', ['$scope', '$http', 'Authentication', '$stateParams', '$location', '$modal', '$log', 'Tests',
	function($scope, $http, Authentication, $stateParams, $location, $modal, $log, Tests) {

	    $scope.choiceOne = [{id: 'choice1'},{id: 'choice2'}]; //answer to question one
	    $scope.choiceTwo = [{id: 'choice1'},{id: 'choice2'}]; //answer to question two
	    $scope.optionOne = [];  //options for question one
	    $scope.optionTwo = []; //options for question two
	    $scope.questions = [];
	    $scope.selected = '';
	    $scope.testName = '';
	    $scope.answered = false;
	    $scope.answeredTwo = false;

	    $scope.setShow = function(val) {
	        $scope.selected = val;
	    };

	    $scope.isSelected = function(val) {
	        return val === $scope.selected;
	    };

	    $scope.addNewChoice = function(num) {
	        var newItemNo;
	        if (num === 1) {
	            newItemNo = $scope.choiceOne.length+1;
	            $scope.choiceOne.push({id: 'choice'+newItemNo});
	        } else {
	            newItemNo = $scope.choiceTwo.length+1;
	            $scope.choiceTwo.push({id: 'choice'+newItemNo});
	        }
	    };

	    $scope.deleteChoice = function(index, num) {
	        if (num === 1) {
	            if (parseInt($scope.test.answerOne, 10) === $scope.choiceOne.length - 1) {
	                $scope.test.answerOne = $scope.test.answerOne-1;
	            }
	            doDelete($scope.choiceOne, $scope.optionOne, index);
	        } else {
	            if (parseInt($scope.test.answerTwo, 10) === $scope.choiceTwo.length - 1) {
	                $scope.test.answerTwo = $scope.test.answerTwo-1;
	            }
	            doDelete($scope.choiceTwo, $scope.optionTwo, index);
	        }
	    };

	    var doDelete = function(choiceArr, optionArr, index) {
            choiceArr.splice(index, 1);
            optionArr.splice(index, 1);

            for (var i in choiceArr) {
                choiceArr[i].id = 'choice' + i;
            }
	    };

	    $scope.showAddChoice = function(choice, num) {
	        if (num === 1)
	            return choice.id === $scope.choiceOne[$scope.choiceOne.length-1].id;
	        else
	            return choice.id === $scope.choiceTwo[$scope.choiceTwo.length-1].id;
	    };

	    $scope.changeAnsVal = function(index, num) {
	        if (num === 1) {
	            $scope.answered = true;
	        } else {
	            $scope.answeredTwo = true;
	        }
	    };

		$scope.createTest = function() {
            var test = new Tests({
                questions: $scope.questions,
                optionOne: $scope.optionOne,
                optionTwo: $scope.optionTwo,
                testName: $scope.testName,
                answerOne: $scope.test.answerOne,
                answerTwo: $scope.test.answerTwo
            });
            test.$save(function(response){
                $location.path('/admin/test');
            }, function(response){
                $scope.error = response.message;
            });
		};

		$scope.createQuestion = function() {
            var test = new Tests({
                _id: $stateParams.testId,
                question: $scope.question,
                option: $scope.optionOne,
                answer: $scope.test.answerOne
            });
            test.$save(function(response){
                $location.path('/admin/test');
            }, function(err){
                $scope.error = err.message;
            });
		};

		$scope.viewTests = function() {
            var tests = Tests.query(function success (response){
                $scope.tests = response;
            });
		};

		$scope.viewTest = function() {
            Tests.get({
                testId: $stateParams.testId
            },  function success(response){
                    $scope.test = response;
                    $scope.testNameEditorEnabled = false;
                    $scope.questionEditorEnabled = [];
                    $scope.editableQuestion = [];
                    $scope.optionEditorEnabled = [];
                    $scope.editableOption = [];
                    $scope.displayerrmsg = [];

                    for (var i in $scope.test.questions){
                        $scope.questionEditorEnabled[i] = false;
                        $scope.optionEditorEnabled[i] = [];
                        $scope.editableOption[i] = [];
                        for (var j in $scope.test.questions[i].questOptions) {
                            $scope.optionEditorEnabled[i][j] = false;
                            $scope.editableOption[i][j] = {};
                        }
                    }

                    $scope.enableEditor = function(field, index, optionIndex) {
                        if (field === 'testName'){
                            $scope.testNameEditorEnabled = true;
                            $scope.editabletestName = $scope.test.testName;
                        }
                        if (field === 'question'){
                            $scope.questionEditorEnabled[index] = true;
                            $scope.editableQuestion[index] = $scope.test.questions[index].question;
                        }

                        if (field === 'option'){
                            $scope.optionEditorEnabled[index][optionIndex] = true;
                            $scope.editableOption[index][optionIndex].option =
                                                  $scope.test.questions[index].questOptions[optionIndex].option;
                        }
                    };

                    $scope.disableEditor = function(field, index, optionIndex) {
                        if (field === 'testName'){
                            $scope.testNameEditorEnabled = false;
                        }
                        if (field === 'question'){
                            $scope.questionEditorEnabled[index] = false;
                        }
                        if (field === 'option'){
                            $scope.optionEditorEnabled[index][optionIndex] = false;
                        }
                    };

                    // Checks to see if all answers are set to same (false/true).
                    // Returns true if all are the same
                    var checkAllanswers = function (questOptions) {
                        var firstOption = questOptions[0].answer
                        for (var i in questOptions) {
                            if (firstOption !== questOptions[i].answer){
                                return false;
                            }
                        }
                        return true;
                    };

                    $scope.save = function(field, index, optionIndex) {
                        if (field === 'testName') {
                            $scope.test.testName = $scope.editabletestName;
                            $scope.changeTestName($scope.test);
                        }
                        if (field === 'question'){
                            $scope.test.questions[index].question = $scope.editableQuestion[index];
                            $scope.updateQuestion($scope.test, index);
                        }
                        if (field === 'option'){
                            $scope.test.questions[index].questOptions[optionIndex].option =
                                                           $scope.editableOption[index][optionIndex].option;
                            if ($scope.editableOption[index][optionIndex].answer === undefined ||
                                              $scope.editableOption[index][optionIndex].answer === 'undefined') {
                                $scope.editableOption[index][optionIndex].answer = false;
                            }

                            // if the option's answer field changes, then change others to it's oppossite
                            if ($scope.editableOption[index][optionIndex].answer === true){
                                for (var i in $scope.test.questions[index].questOptions) {
                                    if (i === optionIndex) {continue;}
                                    $scope.test.questions[index].questOptions[i].answer = false;
                                }
                            }
                            $scope.test.questions[index].questOptions[optionIndex].answer =
                                                            $scope.editableOption[index][optionIndex].answer;
                            // Set error message if no answer is selected
                            if (checkAllanswers ($scope.test.questions[index].questOptions)){
                                $scope.displayerrmsg[index] = true;
                            }
                            else{
                                $scope.displayerrmsg[index] = false;
                            }
                            $scope.updateQuestion($scope.test, index);
                        }

                        $scope.disableEditor(field, index, optionIndex);
                    };
                } //ends test.get() success callbk
            );
		};

        $scope.changeTestName = function(test) {
            test.$update({
                _id: test._id
            }, function success () {},
            function(errorResponse) {
                $scope.error = errorResponse;
            });
        };

		$scope.updateQuestion = function(test, quesIndex) {
            var question = test.questions[quesIndex];
		    $http.put('/admin/test/' + test._id + '/' + test.questions[quesIndex]._id, question).success(function(response) {
		    }).error(function(response) {
    		    $scope.error = response.message;
		    });
		};

        $scope.deleteTest = function(test, index) {
            $scope.tests.splice(index, 1);

            test.$remove({_id: test._id}, function success(){}, function (response){
                $scope.error = response.message;
            });
        };

        $scope.deleteQuestion = function(testId, questionId, index) {
            $scope.test.questions.splice(index, 1);
            $http.delete('/admin/test/' + testId + '/' + questionId).success(function(response) {
                $scope.success = true;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.deleteOption = function(testId, questionId, optionId, queIndex, index) {
            $scope.test.questions[queIndex].questOptions.splice(index, 1);
            $http.delete('/admin/test/' + testId + '/' + questionId + '/' + optionId).success(function(response) {
                $scope.success = true;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
	}
]);
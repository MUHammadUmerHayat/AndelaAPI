'use strict';

var AssessmentController = function($scope, $rootScope, $stateParams, $location, $http) {
	
	// assessment for trainees 
	$scope.createAssessment = function() {
	
		// create new assessment for trainee 
		$scope.assessment = ({
			assessment_name: this.assessment_name,
			assessment_date: $scope.dt,
			score: this.score
		});

		$http.post('/instructor/trainee/'+ $stateParams.applicantId, $scope.assessment).success(function(response) {
			$location.path('/instructors/trainees/' + $stateParams.applicantId);
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});

		this.assessment_name = '';
		this.assessment_date = '';
		this.score = '';
	};

	
	$rootScope.editAssessment = function(index, assessment) {
		$rootScope.assessment = assessment;
		$rootScope.index = index;
	};

	
	// edit trainee assessment record
	$scope.updateAssessment = function() {
		$http.put('/instructor/trainee/' + $scope.assessment.applicantId + '/' + $scope.assessment._id,  $scope.assessment).success(function(response) {
	   
	        // If successful show success message and clear form
	        $location.path('/instructors/trainees/' + $scope.assessment.applicantId);
	  	}).error(function(response) {
	        $scope.error = response.message;
	  	});	
	};

    
    // delete trainee assessment record
	$scope.deleteAssessment = function(index, assessment) {
		$scope.assessments.splice(index, 1);
	  	$http.delete('/instructor/trainee/'+ $stateParams.applicantId +'/'+ assessment._id).success(function(response) {
	 	    $scope.success = true;
		}).error(function(response) {
		   	$scope.error = response.message;
		});   
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

	// $scope.initDate = new Date('2016-15-20');
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'longDate'];
	$scope.format = $scope.formats[4];
	

};
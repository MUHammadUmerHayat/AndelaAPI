'use strict';

// Instructors controller
angular.module('instructors').controller('InstructorsController', ['$scope', '$rootScope', '$upload', '$stateParams', '$location', 'Authentication', '$http',
	function($scope, $rootScope, $upload, $stateParams, $location, Authentication, $http) {
		$scope.user = Authentication.user;


		// instructor sigin 
		$scope.instructor_signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.user = response;
				//And redirect to the right page
				if ($scope.user.role === 'instructor') {
					$location.path('/instructors/home');	
				}
				else{
					console.log('instructorsigin');
					$location.path('/');
				}
			}).error(function(response) {
				$scope.error = response.message;
				$location.path('/');
			});
		};


		$scope.instructorHome = function(){
			if (!$scope.user) {
					$location.path('/');
			}
		};

		// for bootcamps
		$scope.listBootcamps = function() {

			$scope.appl_length= 0;
		  	$http.get('/instructor/bootcamps').success(function(response) {
		    // If successful show success message and clear form
		    	$scope.success = true;
		    	$scope.bootcamps = response;
		  	}).error(function(response) {
                console.log('error');
		    $scope.error = response.message;
		  	});
		};

		$scope.viewBootcamp = function() {
			if ($stateParams.bootcampId.length < 20) {
				$location.path('/');
			}else{
			  	$http.get('/instructor/camp/' + $stateParams.bootcampId).success(function(response) {
			    // If successful show success message and clear form
			    	$scope.success = true;
			    	$scope.bootcamp = response;
			    	$scope.applicants = $scope.bootcamp.applicants;
				}).error(function(response) {
                    console.log('error');
				    $scope.error = response.message;
				}); 
			}
		};


		// for trainees
		$scope.listTrainees = function() {
			console.log('inside listcontroller');
		  	$http.get('/instructor').success(function(response) {
		    // If successful show success message and clear form
		    	$scope.success = true;
		    	$scope.trainees = response;																		
		  }).error(function(response) {
            console.log('error');
		    $scope.error = response.message;
		  	});
		};

				
		$rootScope.viewTrainee = function() {
			if ($stateParams.applicantId.length < 20) {
				$location.path('/');
			}else{
				$rootScope.traineeId = $stateParams.applicantId;
				$http.get('/instructor/trainee/' + $rootScope.traineeId).success(function(response) {
			    // If successful show success message and clear form
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

		$scope.updateAssessment = function() {
			$http.put('/instructor/trainee/' + $scope.assessment.applicantId + '/' + $scope.assessment._id,  $scope.assessment).success(function(response) {
		    // If successful show success message and clear form
		    $location.path('/instructors/trainees/' + $scope.assessment.applicantId);
		  	}).error(function(response) {
		    $scope.error = response.message;
		  	});	
		};

		$scope.deleteAssessment = function(index, assessment) {

			$scope.assessments.splice(index, 1);
		  	$http.delete('/instructor/trainee/'+ $stateParams.applicantId +'/'+ assessment._id).success(function(response) {
		 	    $scope.success = true;
			}).error(function(response) {
			   	$scope.error = response.message;
			});   
		};

		// for fellows
		$scope.listFellows = function() {
		  	$http.get('/instructor/fellows').success(function(response) {
		    // If successful show success message and clear form
		    	$scope.success = true;
		    	$scope.fellows = response;
		  	}).error(function(response) {
		    $scope.error = response.message;

		 	});
		};


		$scope.viewFellow = function() {
			if ($stateParams.fellowId.length < 20) {
				$location.path('/');
			}else{
				$http.get('/instructor/trainee/' + $stateParams.fellowId).success(function(response) {
			    // If successful show success message and clear form
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


		$scope.ratefellow = function() {
	        $http.post('/instructor/trainee/' + $stateParams.fellowId + '/rate', $scope.data).success(function(response) {
	        $scope.success = true;
	        $location.path('/instructors/fellows/' + $stateParams.fellowId);
	      	}).error(function(response) {
	        $scope.error = response.message;
	      	});
	    };


		$scope.deleteRate = function(index, skillSet) {
			$scope.skillSets = $scope.fellow.skillSets;
			$scope.skillSets.splice(index, 1);
		  	$http.delete('/instructor/trainee/'+ $scope.fellow._id +'/rate/'+ skillSet._id).success(function(response) {
		 	    $scope.success = true;
			}).error(function(response) {
                console.log('error');
			   	$scope.error = response.message;
			});   
		};

		
		$scope.editFellowRate= function(){
			$http.put('/instructor/trainee/' + $stateParams.fellowId + '/rate/' + $stateParams.skillSetId, $scope.skillSetsNow).success(function(response) {
		    // If successful show success message and clear form
		    	$scope.success = true;
		    	$location.path('/instructors/fellows/' + $stateParams.fellowId);
		  	}).error(function(response) {
		    $scope.error = response.message;
		  	});
		};
		

 // Upload Image
	    $scope.onFileSelect = function($file) {
			$scope.file = $file;
			if ($scope.file) { 
				if ($scope.file[0].type === 'image/jpeg' || $scope.file[0].type === 'image/png') {
				    $scope.correctFormat = true; 
				} else {
				   $scope.correctFormat = false; 
			    }
			}
	    };


	    $scope.removeAlert = function(message) {
            if (message === "error") {
                $scope.error = null;
            } else {
              	$scope.success = null;
            }
        };


        // upload file
		$scope.create = function() {;
			$scope.success = null;
			$scope.error = null;
			$scope.upload = $upload.upload({
	            url: '/instructor/updateInfo',
	            method: 'POST',
	            data: $scope.details,
	            file: $scope.file
	        }).success(function(response) {
	        	// $scope.instr = response;
	            $scope.success = 'Your details have been updated successfully';
	        }).error(function(err) {
	        	$scope.error = err.message;;
	        });
		};


		$scope.deletePhoto = function($index, photo){
			$scope.photo = $scope.user.photo;
			$scope.user.photo = "";	
			$http.delete('/instructor/' + $scope.user._id + '/deletePhoto').success(function(response){
				 $scope.success = true;
		 		$scope.photo = response;
		 		$scope.upload_new=true;
			}).error(function(response) {
			   	$scope.error = response.message;

			});
		};


		$scope.showImage = function(img) {
		 	if (img) {
               img = img.substring(6);
            	return img;
		 	}    
        };


		// instructor rates his skills
		$scope.rateInstr = function() {
	      //Permissions check
		    if ($scope.user === null){
		        $location.path('/');
		    }
		    else if ($scope.user.role !== 'instructor'){
		        $location.path('/');
		    }

		    $http.post('/instructor/skill', $scope.data).success(function(response) {
		        // If successful show success message and clear form
		        $scope.success = true;
		        $location.path('/instructors/home');
		        
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


		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'longDate'];
		$scope.format = $scope.formats[4];
		
	}
	
]);


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
				console.log('signed');

				//And redirect to the right page
				console.log($scope.user);
				console.log($scope.credentials);

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
			console.log(Authentication.user);
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
		    $scope.error = response.message;
		  	});
		};

		// if $locaton.path('/')


		$scope.viewBootcamp = function() {
			console.log($stateParams.bootcampId.length);
			if ($stateParams.bootcampId.length < 20) {
				$location.path('/');
			}else{
			
			  	$http.get('/instructor/camp/' + $stateParams.bootcampId).success(function(response) {
			    // If successful show success message and clear form
			    	console.log('/instructor/camp/' + $stateParams.bootcampId);
			    	$scope.success = true;
			    	$scope.bootcamp = response;
			    	console.log($scope.bootcamp);
			    	$scope.applicants = $scope.bootcamp.applicants;
			    	// console.log($scope.applicants);
				}).error(function(response) {
				    $scope.error = response.message;
				}); 
			}
		};


		// for trainees
		$scope.listTrainees = function() {
			console.log('inside listcontroller');
		  	$http.get('/instructor').success(function(response) {
		    // If successful show success message and clear form
		    // $scope.user;
		    console.log('working list');
		    	$scope.success = true;

		    	$scope.trainees = response;
		    	console.log($scope.trainees);
																																																				    	// $location.path('instructors/applicants');
		  }).error(function(response) {
		    $scope.error = response.message;

		  	});
		};

				
		$rootScope.viewTrainee = function() {
			if ($stateParams.applicantId.length < 20) {
				$location.path('/');
			}else{
			
				$rootScope.traineeId = $stateParams.applicantId;
				$http.get('/instr/trainee/' + $rootScope.traineeId).success(function(response) {
			    // If successful show success message and clear form
			    	$scope.success = true;
			    	$rootScope.trainee = response;
		
			    	$rootScope.assessments = $rootScope.trainee.assessments;   	    	
			    	angular.forEach($rootScope.trainee.assessments, function(assessment, key){
			    		$rootScope.assessment = assessment; 
			    		console.log(assessment); 
			    		console.log(user._id); 
			    		console.log(assessment.instructorId);
			    	});
			 
			    	// $location.path('instructors' + applicant._id);
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

			console.log($scope.assessment);
			// console.log($stateParams);
			// console.log($scope.assessment.assessment_name);
			
				// $scope.enterNew = false;
			$http.post('/instr/trainee/'+ $stateParams.applicantId, $scope.assessment).success(function(response) {
				
				$location.path('/instructors/trainees/' + $stateParams.applicantId);
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.assessment_name = '';
			this.assessment_date = '';
			this.score = '';
			  	console.log(typeof assessment_date);
		};

		$rootScope.editAssessment = function(index, assessment) {
			$rootScope.assessment = assessment;
			$rootScope.index = index;
			console.log($rootScope.assessment);
		};

		$scope.updateAssessment = function() {
			console.log($scope.index);
			$http.put('/instr/trainee/' + $scope.assessment.applicantId + '/' + $scope.assessment._id,  $scope.assessment).success(function(response) {
		    // If successful show success message and clear form
		    $location.path('/instructors/trainees/' + $scope.assessment.applicantId);
		  	}).error(function(response) {
		    $scope.error = response.message;
		  	});	
		};

		$scope.deleteAssessment = function(index, assessment) {

			$scope.assessments.splice(index, 1);
			console.log('response');
		  	$http.delete('/instr/trainee/'+ $stateParams.applicantId +'/'+ assessment._id).success(function(response) {
		 		console.log('response');
		 	    $scope.success = true;
		 	    console.log("responsem");
			}).error(function(response) {
			   	$scope.error = response.message;
			});   
		};
 

		// $scope.selectFellow = function() {
		// 	console.log($scope.trainee.role);
		// 	$scope.trainee.role = "fellow";
		// 	console.log($scope.trainee);
			
		//   	$http.put('/instr/trainee/' + $stateParams.applicantId, $scope.trainee).success(function(response) {
		//     // If successful show success message and clear form
		    
		//     	$scope.success = true;
		//     	$location.path('instructors/fellow_selected/' + $scope.traineeId);
		//   	}).error(function(response) {
		//     $scope.error = response.message;
		//   	});
		// };
		

		// for fellows
		$scope.listFellows = function() {
		  	$http.get('/instr/fellows').success(function(response) {
		    // If successful show success message and clear form
		    	$scope.success = true;
		    	$scope.fellows = response;
		    	console.log($scope.fellows);
		    	// $location.path('instructors'...);
		  	}).error(function(response) {
		    $scope.error = response.message;

		 	});
		};


		$scope.viewFellow = function() {
			if ($stateParams.fellowId.length < 20) {
				$location.path('/');
			}else{
				$http.get('/instr/trainee/' + $stateParams.fellowId).success(function(response) {
			    // If successful show success message and clear form
			    	$scope.success = true;
			    	$scope.fellow = response;
			    	angular.forEach($scope.fellow.skillSets, function(skillSets, key){
			    		$scope.skillSets = skillSets;  
			    		console.log(user._id); 
			    		console.log($scope.fellow);
			    	});
			    	
			    	// $location.path('instructors' + applicant._id);
			  	}).error(function(response) {
			    $scope.error = response.message;

			  	});
			}
		};


		$scope.ratefellow = function() {
	      //Permissions check
	      console.log($stateParams);
	      console.log($scope.data);
	        $http.post('/instr/trainee/' + $stateParams.fellowId + '/rate', $scope.data).success(function(response) {
	        // If successful show success message and clear form
	        $scope.success = true;
	        console.log('Success - Done', response + $stateParams.fellowId);
	        $location.path('/instructors/fellows/' + $stateParams.fellowId);
	        
	      	}).error(function(response) {
	        $scope.error = response.message;
	        console.log('Error - can not');
	      	});
	    };


		
		$scope.deleteRate = function(index, skillSet) {
			$scope.skillSets = $scope.fellow.skillSets;
			$scope.skillSets.splice(index, 1);
		  	$http.delete('/instr/trainee/'+ $scope.fellow._id +'/rate/'+ skillSet._id).success(function(response) {
		 		console.log('response');
		 	    $scope.success = true;
		 	    console.log("responsem");
			}).error(function(response) {
			   	$scope.error = response.message;
			});   
		};

		// $rootScope.editRate= function(index, skillSets) {
		// 	$rootScope.skillSets = skillSets;
		// 	$rootScope.index = index;
		// 	console.log($rootScope.skillSets);
		// };

		// $scope.editingRate = function(){
		// 	$scope.skillSetsNow = $scope.skillSets;
		// 	console.log($scope.skillSetsNow);

		// };
		
		$scope.editFellowRate= function(){
		console.log($scope.skillSets);
		console.log($stateParams);

			$http.put('/instr/trainee/' + $stateParams.fellowId + '/rate/' + $stateParams.skillSetId, $scope.skillSetsNow).success(function(response) {
		    // If successful show success message and clear form
		    	$scope.success = true;
		    	console.log('success');
		    	// console.log();
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
		$scope.create = function() {
			console.log($scope.details + $scope.details.exp);
			$scope.success = null;
			$scope.error = null;
			$scope.upload = $upload.upload({
	            url: '/instr/updateInfo',
	            method: 'POST',
	            data: $scope.details,
	            file: $scope.file
	        }).success(function(response) {
	        	// $scope.instr = response;
	            $scope.success = 'Your details have been updated successfully';
	        }).error(function(err) {
	        	$scope.error = err.message;
	            console.log('Error uploading file: ' + err.message || err);
	        });
		};

		$scope.deletePhoto = function($index, photo){
			$scope.photo = $scope.user.photo;
			$scope.user.photo = "";
			console.log($scope.photo);
			//  $scope.delete_image = !$scope.delete_image;	
			// console.log( $scope.delete_image);	
			$http.delete('/instr/' + $scope.user._id + '/deletePhoto').success(function(response){
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

		    $http.post('/instr/skill', $scope.data).success(function(response) {
		        // If successful show success message and clear form
		        $scope.success = true;
		        console.log('Success - Done', response);
		        console.log($scope.data);
		        $location.path('/instructors/home');
		        
		    }).error(function(response) {
		        $scope.error = response.message;
		        console.log('Error - can not');
		    });
	      
	    };

	    $scope.editingSkill = function() {
	    	console.log($stateParams);
	    };
	    // '/instr/skill/:userId/:skillId'

		
		$scope.editSkill = function(){
		// 	$http.put('/instr/skill/:userId/:skillId').success(function(response) {
		//     // If successful show success message and clear form
		//     	$scope.success = true;
		//     	// $location.path('instructors'...);
		//   	}).error(function(response) {
		//     $scope.error = response.message;

		//   	});

		};


		$scope.deleteSkill = function($index, skillSet){
			console.log($stateParams);
			// $scope.skillSet.splice(index, 1);

		};

		// $scope.deleteRating = function(){
		// 	$scope.success = $scope.error = null;

		// 	$http.delete('/instr/skill/:userId/:skillId').success(function(response) {
		//     // If successful show success message and clear form
		//     	$scope.success = true;
		//     	// $location.path('instructors'...);
		//   	}).error(function(response) {
		//     $scope.error = response.message;

		//   	});

		// };



	    $scope.today = function() {
	    	$scope.dt = new Date();
	    	// $scope.dt = assessment_date;
	    	console.log(typeof $scope.dt);
	    	console.log($scope.dt);
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
		
		 // assessment_date: "2014-12-09T23:00:00.000Z
		
	}
	
	
]);


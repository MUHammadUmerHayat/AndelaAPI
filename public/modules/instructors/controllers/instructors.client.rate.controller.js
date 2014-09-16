var RateController = function($scope, $stateParams, $location, $http) {
	$scope.ratefellow = function() {
	      //Permissions check

	    $http.post('/instructor/trainee/' + $stateParams.fellowId + '/rate', $scope.data).success(function(response) {
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
	  	$http.delete('/instructor/trainee/'+ $scope.fellow._id +'/rate/'+ skillSet._id).success(function(response) {
	 		console.log('response');
	 	    $scope.success = true;
	 	    console.log("responsem");
		}).error(function(response) {
		   	$scope.error = response.message;
		});   
	};


	$scope.editFellowRate= function(){
	console.log($scope.skillSets);
	console.log($stateParams);

		$http.put('/instructor/trainee/' + $stateParams.fellowId + '/rate/' + $stateParams.skillSetId, $scope.skillSetsNow).success(function(response) {
	    // If successful show success message and clear form
	    	$scope.success = true;
	    	console.log('success');
	    	// console.log();
	    	$location.path('/instructors/fellows/' + $stateParams.fellowId);
	  	}).error(function(response) {
	    $scope.error = response.message;

	  	});

	};

};

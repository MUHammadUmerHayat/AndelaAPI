angular.module('instructors').controller('RateController', ['$scope', '$stateParams', '$location', '$http',
    function($scope, $stateParams, $location, $http) {
		
		$scope.ratefellow = function() {
		    
		    // Permissions check
		    $http.post('/instructor/trainee/' + $stateParams.fellowId + '/rate', $scope.data).success(function(response) {
		    
			    // If successful show success message and clear form
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
			   	$scope.error = response.message;
			});   
		};


		$scope.editFellowRate= function() {
			$http.put('/instructor/trainee/' + $stateParams.fellowId + '/rate/' + $stateParams.skillSetId, $scope.skillSetsNow).success(function(response) {
		       
		        // If successful show success message and clear form
		    	$scope.success = true;
		    	$location.path('/instructors/fellows/' + $stateParams.fellowId);
		  	}).error(function(response) {
		        $scope.error = response.message;
		  	});
		};
    }
]);

 
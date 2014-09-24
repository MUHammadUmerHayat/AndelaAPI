'use strict';


var ProfileController = function($scope, $upload, $stateParams, $location) {

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
		$scope.success = null;
		$scope.error = null;
		$scope.upload = $upload.upload({
            url: '/instructor/updateInfo',
            method: 'POST',
            data: $scope.details,
            file: $scope.file
        }).success(function(response) {
        	user.photo = response.photo;
            $scope.success = 'Your details have been updated successfully';
        }).error(function(err) {
        	$scope.error = err.message;
        });
	};


	$scope.deletePhoto = function($index, photo){
		$scope.photo = $scope.user.photo;
		$scope.user.photo = "";
		$http.delete('/instructor/' + $scope.user._id + '/deletePhoto').success(function(response){
			$scope.success = true;
	 		$scope.photo = response.photo;

	 		$scope.upload_new = true;
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


};
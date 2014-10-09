'use strict';


var ProfileController = function($scope, $http, $upload, $stateParams, $location, Authentication) {
    $scope.user = Authentication.user;

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
            data: $scope.user,
            file: $scope.file
        }).success(function(response) {
        	$scope.user.photo = response.photo;
        	Authentication.user = response;
            $scope.success = 'Your details have been updated successfully';
        }).error(function(err) {
        	$scope.error = err.message;
        });
	};

	// delete profile picture
	$scope.deletePhoto = function($index, photo) {
		$http.delete('/instructor/' + $scope.user._id + '/deletePhoto').success(function(response) {
	 		$scope.user.photo = response.photo; 
		}).error(function(response) {
		   	$scope.error = response.message;
		});
	};

    // show instructor's profile photo
	$scope.showImage = function(img) {
	 	if (img) {
            img = img.substring(6);
        	return img;
	 	} else {
	 		return 'http://www.localcrimenews.com/wp-content/uploads/2013/07/default-user-icon-profile.png';
	 	}
    };
}
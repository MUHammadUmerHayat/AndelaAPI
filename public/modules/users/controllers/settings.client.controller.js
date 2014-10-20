'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$timeout', '$http', '$location', 'Users', 'Authentication',
	function($scope,  $timeout, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function() {
			var user = new Users($scope.user);

			user.$update(function(response) {
				$scope.successOne = true;
				$scope.user = Authentication.user = response;
				$timeout(function() {
	              $scope.successOne = null;
	            }, 5000);
			}, function(response) {
				$scope.errorOne = response.data.message;
				$timeout(function() {
	              $scope.errorOne = null;
	            }, 5000);
			});
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;
			$http.post('/users/' + $scope.user._id + '/password', $scope.passwordDetails).success(function(response) {
				
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
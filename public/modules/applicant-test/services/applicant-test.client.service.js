'use strict';

//Test service used for communicating with the tests REST endpoints
angular.module('applicant-test').factory('Questions', ['$resource',
	function($resource) {
		return $resource('/test/:testId', {
			testId: '@_id'
		}, {
			updates:{
				method: 'PUT'
			}
		});
	}
]);
// 'use strict'

//Setting up route
angular.module('applicant-test').config(['$stateProvider', 
	function($stateProvider){
		//Test state routing
		$stateProvider.
		state('listTest', {
			url: '/test/:testId',
			templateUrl: 'modules/applicant-test/views/test.client.view.html'
		});
	}
]);
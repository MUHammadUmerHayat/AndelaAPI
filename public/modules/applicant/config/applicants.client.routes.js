'use strict';

//Setting up route
angular.module('applicant').config(['$stateProvider',
    function($stateProvider) {
        // Applicant state routing
        $stateProvider.
        state('applicantsprofile', {
            url: '/profile/applicant',
            templateUrl: 'modules/applicant/views/applicantion.client.view.html'
        }).
        state('fellowsprofile', {
            url: '/profile/fellows',
            templateUrl: 'modules/applicant/views/list.fellow.client.view.html'
        }).
        state('traineesprofile', {
            url: '/profile/trainee',
            templateUrl: 'modules/applicant/views/trainee.client.view.html'
        }).
        state('fellow-profile', {
            url: '/profile/:applicantId',
            templateUrl: 'modules/applicant/views/fellow.client.view.html'
        }).
        state('logged_in-profile', {
            url: '/logged_in_user/:logged_inId',
            templateUrl: 'modules/applicant/views/logged_in.user.client.view.html'
        }).
        state('application', {
            url: '/signup',
            templateUrl: 'modules/applicant/views/applicant.client.view.html'
        }).
        state('success', {
            url: '/successpage',
            templateUrl: 'modules/applicant/views/success.client.view.html'
        }).
        state('error_page', {
            url: '/errorpage',
            templateUrl: 'modules/applicant/views/error.client.view.html'
        });

    }
]);

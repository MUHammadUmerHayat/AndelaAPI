'use strict';

// Setting up route
angular.module('instructors').config(['$stateProvider',
    function($stateProvider) {

        // Instructors state routing
        $stateProvider.
        state('instructor_signin', {
            url: '/instructors',
            templateUrl: 'modules/instructors/views/instructor_signin.client.view.html'
        }).
        state('instructorshome', {
            url: '/instructors/home',
            templateUrl: 'modules/instructors/views/instructors_home.client.view.html'
        }).
        state('list_Trainees', {
            url: '/instructors/trainees',
            templateUrl: 'modules/instructors/views/list-trainees.client.view.html'
        }).
        state('view_Trainee', {
            url: '/instructors/trainees/:applicantId',
            templateUrl: 'modules/instructors/views/view-trainee.client.view.html'
        }).
        state('create_Assessment', {
            url: '/instructors/trainees/:applicantId/create_assessment',
            templateUrl: 'modules/instructors/views/create-assessment.client.view.html'
        }).
        state('editAssessment', {
            url: '/instructors/trainees/:applicantId/:assessmentId/edit',
            templateUrl: 'modules/instructors/views/edit-assessment.client.view.html'
        }).
        state('selected_fellow', {
            url: '/instructors/fellow_selected/:applicantId',
            templateUrl: 'modules/instructors/views/selected-fellow.client.view.html'
        }).
        state('list_Fellows', {
            url: '/instructors/fellows',
            templateUrl: 'modules/instructors/views/list-fellows.client.view.html'
        }).
        state('viewFellow', {
            url: '/instructors/fellows/:fellowId',
            templateUrl: 'modules/instructors/views/view-fellow.client.view.html'
        }).
        state('ratefellow', {
          url: '/instructors/fellow/:fellowId/rate',
          templateUrl: 'modules/instructors/views/rate.fellow.client.view.html'
        }).
        state('editRate', {
            url: '/instructors/fellow/:fellowId/:skillSetId/editRate',
            templateUrl: 'modules/instructors/views/edit-rate.client.view.html'
        }).
        state('listBootcamps', {
            url: '/instructors/bootcamps',
            templateUrl: 'modules/instructors/views/list-bootcamps.client.view.html'
        }).
        state('viewBootcamp', {
            url: '/instructors/bootcamps/:bootcampId',
            templateUrl: 'modules/instructors/views/view-bootcamp.client.view.html'
        }).
        state('editProfile', {
            url: '/instructors/editProfile',
            templateUrl: 'modules/instructors/views/edit-profile.client.view.html'
        }).
        state('change_Password', {
            url: '/change-password',
            templateUrl: 'modules/users/views/settings/change-password.client.view.html'
        }).
        state('addSkills', {
            url: '/instructors/addSkill',
            templateUrl: 'modules/instructors/views/skills.client.view.html'
        }).
        state('editSkills', {
            url: '/instructors/editSkills',
            templateUrl: 'modules/instructors/views/edit-skill.client.view.html'
        });
    }
]);
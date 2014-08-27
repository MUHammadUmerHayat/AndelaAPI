'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
  function($stateProvider) {
    // Lists state routing
    $stateProvider.
    state('signInUser', {
      url: '/admin',
      templateUrl: 'modules/admin/views/admin.signin.view.html'
    }).
    state('createUser', {
      url: '/admin/create',
      templateUrl: 'modules/admin/views/admin.create.users.html'
    }).
    state('adminWelcome', {
      url: '/admin/welcome',
      templateUrl: 'modules/admin/views/admin.welcome.html'

    }).
    state('listAppts', {
      url: '/admin/appts',
      templateUrl: 'modules/admin/views/list.applicants.admin.html'
    }).
    state('viewAppt', {
      url: '/admin/appt/:apptId',
      templateUrl: 'modules/admin/views/view.applicant.admin.html'
    }).
    state('editAppt', {
      url: '/admin/editappt/:apptId',
      templateUrl: 'modules/admin/views/edit.appt.form.admin.html'
    }).
    state('listTrainees', {
      url: '/admin/trainees',

      templateUrl: 'modules/admin/views/list.trainees.admin.html'
    }).
    state('listFellows', {
      url: '/admin/fellows',
      templateUrl: 'modules/admin/views/list.fellows.admin.html'
    });
    
  }
]);


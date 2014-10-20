'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
        state('home', {
            url: '/',
            templateUrl: 'modules/core/views/home.client.view.html'
        }).
        state('mission', {
            url: '/mission',
            templateUrl: 'modules/core/views/mission.client.view.html'
        }).
        state('about', {
            url: '/meet_team',
            templateUrl: 'modules/core/views/about.client.view.html'
        }).
        state('andela_network', {
            url: '/andela_network',
            templateUrl: 'modules/core/views/andela.network.client.view.html'
        }).
        state('skill_focus', {
            url: '/skill_focus',
            templateUrl: 'modules/core/views/skill_focus.client.view.html'
        }).
        state('timeline', {
            url: '/timeline',
            templateUrl: 'modules/core/views/timeline.client.view.html'
        }).
        state('selection', {
            url: '/selection',
            templateUrl: 'modules/core/views/selection.client.view.html'
        }).
        state('assessment', {
            url: '/assessment',
            templateUrl: 'modules/core/views/take_assessment.client.view.html'
        });
    }
]);

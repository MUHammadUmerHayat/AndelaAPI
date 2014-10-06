'use strict';

//Applicants service used for communicating with the camp REST endpoints
angular.module('applicant').factory('Applicants', ['$resource',
    function($resource) {
        return $resource('applicants/:applicantId', {
            applicantId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('applicant').factory('Users', ['$resource',
    function($resource) {
        return $resource('users/:userId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('applicant').factory('Bootcamps', ['$resource',
    function($resource) {
        return $resource('/camps', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

//Test service used for communicating with the tests REST endpoints
angular.module('applicant-test').factory('Questions', ['$resource',
    function($resource) {
        return $resource('/test/:testId', {
            testId: '@_id'
        }, {
            updates: {
                method: 'PUT'
            }
        });
    }
]);

'use strict';

// Instructors service used to communicate Instructors REST endpoints
angular.module('instructors').factory('Instructors', ['$resource',
    function($resource) {
        return $resource('instructor/:instructorId', { instructorId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])

// Test service for communicating with the test api endpoint
.factory('Tests', ['$resource',
    function($resource) {
        return $resource('instructor', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
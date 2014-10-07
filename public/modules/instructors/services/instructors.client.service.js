'use strict';

// Assessment service
angular.module('instructors').factory('Assessment', ['$resource',
    function($resource) {
        return $resource('instructor/trainee/:traineeId/:assmtId', { traineeId: '@traineeId', assmtId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])

// Instructor service
.factory('Tests', ['$resource',
    function($resource) {
        return $resource('instructor', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
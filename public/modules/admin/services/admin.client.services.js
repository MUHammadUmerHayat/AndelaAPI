'use strict';

// Admin service for admin variables
angular.module('admin')
.factory('Users', ['$resource',
    function($resource) {
        return $resource('admin', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
])

.filter('range', function() {
    return function(input, total, start){
        total = parseInt(total);
        for (var i=start; i<total; i++)
            input.push(i);
        return input;
    };
})

//Test service for communicating with the test api endpoint
.factory('Tests', ['$resource',
    function($resource) {
        return $resource('admin/test/:testId', {
            testId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])

.factory('Bootcamps', ['$resource',
    function($resource) {
        return $resource('/admin/camp/:bootCampId', {
            bootCampId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
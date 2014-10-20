'use strict';

// Assessment service
angular.module('instructors').factory('Assessment', ['$resource',
    function($resource) {
        return $resource('instructor/trainee/:traineeId/:assmtId', {
            traineeId: '@traineeId',
            assmtId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
])

// Camp service
.factory('Camp', ['$resource',
    function($resource) {
        return $resource('instructor/camp/:campId', {
            campId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

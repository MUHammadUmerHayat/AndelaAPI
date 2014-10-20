'use strict';

var test = require('../../app/controllers/test'),
    users = require('../../app/controllers/users'),
    admin = require('../../app/controllers/admin');

module.exports = function(app) {

    app.route('/test').get(test.list);
    // Viewing a specifib question
    app.route('/test/:testId')
        //commented by Ayoola
        //	.get(users.requiresLogin, test.read);
        .get(test.read);

    //Finish by binding the test middleware
    app.param('testId', admin.testByID);
};

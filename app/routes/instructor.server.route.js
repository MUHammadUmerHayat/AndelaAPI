'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    admin = require('../../app/controllers/admin'),
    instructor = require('../../app/controllers/instructor');

module.exports = function(app) {
    /*** Instructor Routes ***/

    // list all trainees
    app.route('/instructor')
        .get(users.requiresLogin, instructor.checkRights, admin.listTrainees);


    // list all fellows
    app.route('/instructor/fellows')
        .get(users.requiresLogin, instructor.checkRights, admin.listFellows);


    // instructor updates his personal info
    app.route('/instructor/updateInfo')
        .post(users.requiresLogin, instructor.checkRights, instructor.updateInfo);


    // instructor can delete his profile photo
    app.route('/instructor/:userId/deletePhoto')
        .delete(users.requiresLogin, instructor.checkRights, instructor.deletePhoto);


    // instructor can add skills for himself
    app.route('/instructor/skill')
        .post(users.requiresLogin, instructor.checkRights, instructor.addSkills);
    

    // view all bootcamps
    app.route('/instructor/bootcamps')
        .get(users.requiresLogin, instructor.checkRights, admin.bootCamps);


    // view  a particular bootcamp
    app.route('/instructor/camp/:campId')
        .get(users.requiresLogin, instructor.checkRights, admin.read);

    
    // instructor can view a particular trainee and enter assessment records
    app.route('/instructor/trainee/:traineeId')
        .get(users.requiresLogin, instructor.checkRights, instructor.readTrainee)
        .post(users.requiresLogin, instructor.checkRights, instructor.createAssmt);

    
    // update and delete a particular assessment record of a trainee
    app.route('/instructor/trainee/:traineeId/:assmtId')
        .put(users.requiresLogin, instructor.checkRights, instructor.isCreator, instructor.updateAssmt)
        .delete(users.requiresLogin, instructor.checkRights, instructor.isCreator, instructor.deleteAssmt);


    // Finish by binding the trainee middleware
    app.param('traineeId', instructor.traineeByID);

    
    // Finish by binding the assessment middleware
    app.param('assmtId', instructor.assessmentByID);

    
    // Finish by binding the skillset middleware
    app.param('skillId', admin.skillById);
};
'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    admin = require('../../app/controllers/admin'),
    instructor = require('../../app/controllers/instructor');

module.exports = function(app) {
    // Instructor Routes
    app.route('/instructor')
        .get(users.requiresLogin, instructor.checkRights, admin.listTrainees);
        

    //instructor updates his personal info
    app.route('/instructor/updateInfo')
        .post(users.requiresLogin, instructor.checkRights, instr.updateInfo);

    //instructor can delete his photo avatar
    app.route('/instructor/:userId/deletePhoto')
        .delete(users.requiresLogin, instructor.checkRights, instr.deletePhoto);


    app.route('/instructor/fellows')
        .get(users.requiresLogin, instructor.checkRights, admin.listFellows);
        

    app.route('/instructor/bootcamps')
        .get(users.requiresLogin, instructor.checkRights, admin.bootCamps);
    
    //instructor can add skills for himself
    app.route('/instructor/skill')
        .post(users.requiresLogin, instructor.checkRights, instr.addSkills);
    
    //admin can checkout bootcamp instructors
    app.route('/instructor/camp/:campId')
        .get(users.requiresLogin, instructor.checkRights, admin.read);

    //instructor can look for a fellow , set assesment...
    app.route('/instructor/trainee/:traineeId')
        .get(users.requiresLogin, instructor.checkRights, instructor.readTrainee)
        .put(users.requiresLogin, instructor.checkRights, instructor.selectFellow)
        .post(users.requiresLogin, instructor.checkRights, instructor.createAssmt);

    //instructor can make assesment updates
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
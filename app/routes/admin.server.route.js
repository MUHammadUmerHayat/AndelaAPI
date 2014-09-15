'use strict';

/*****
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    admin = require('../../app/controllers/admin'),
    instructor = require('../../app/controllers/instructor');


module.exports = function(app) {

    // Setting up the Admin api
    app.route('/admin')
        .get(users.requiresLogin, admin.checkPermission, admin.listApplicants);
    
    app.route('/admin/create')
        .post(users.requiresLogin, admin.checkPermission, admin.createUsers);

    app.route('/admin/trainees')
        .get(users.requiresLogin, admin.checkPermission, admin.listTrainees);

    app.route('/admin/applicants')
        .get(users.requiresLogin, admin.checkPermission, admin.listApplicants);

    app.route('/admin/fellows')
        .get(users.requiresLogin, admin.checkPermission, admin.listFellows);

    app.route('/admin/instructors')
        .get(users.requiresLogin, admin.checkPermission, admin.listInstructors);

    app.route('/admin/admins')
        .get(users.requiresLogin, admin.checkPermission, admin.listAdmins);

    app.route('/admin/applicant/:applicantId')
        .get(users.requiresLogin, admin.checkPermission, admin.applicantRead) 
        .put(users.requiresLogin, admin.checkPermission, admin.changeStatus)
        .put(users.requiresLogin, admin.checkPermission, admin.updateApplicantDetails);

    app.route('/admin/applicant/:applicantId/role')
        .put(users.requiresLogin, admin.checkPermission, admin.changeRole);

    app.route('/admin/instructor/:instructorId')
        .get(users.requiresLogin, admin.checkPermission, admin.instructorRead)  
        .put(users.requiresLogin, admin.checkPermission, admin.changeInstrRole); 

    app.route('/admin/user/:userId')
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteUser);

    app.route('/admin/fellow/:userId/placements')
        .get(users.requiresLogin, admin.checkPermission, admin.getPlacements)
        .post(users.requiresLogin, admin.checkPermission, admin.addPlacement);

    app.route('/admin/fellow/:userId/placements/:placementId')
        .get(users.requiresLogin, admin.checkPermission, admin.getPlacement) 
        .put(users.requiresLogin, admin.checkPermission, admin.editPlacement)
        .delete(users.requiresLogin, admin.checkPermission, admin.deletePlacement);

    // Setting up Camp Api
    app.route('/admin/camp')
        .get(users.requiresLogin, admin.checkPermission,  admin.bootCamps)
        .post(users.requiresLogin, admin.checkPermission, admin.createBootCamp);
    
    app.route('/admin/camp/:campId')
        .get(users.requiresLogin, admin.checkPermission, admin.read) 
        .put(users.requiresLogin, admin.checkPermission, admin.editCamp)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteCamp);

    // Setting up Skills Api
    app.route('/admin/skillCategories')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkillCategories)
        .post(users.requiresLogin, admin.checkPermission, admin.createSkillCategory);

     app.route('/admin/skillCategories/:skillCategoryId')
        .get(users.requiresLogin, admin.checkPermission, admin.getSkillCategory)
        .put(users.requiresLogin, admin.checkPermission, admin.updateSkillCategory)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteSkillCategory);
       
    app.route('/admin/skills')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkills);

    app.route('/admin/skillCategories/:skillCategoryId/skills')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkillsByCategory)
        .post(users.requiresLogin, admin.checkPermission, admin.createSkill);
        

    app.route('/admin/trainee/:traineeId/skills/:skillId')
        .put(users.requiresLogin, admin.checkPermission, instructor.editFellowRating);

    // Setting up Test Api
    app.route('/admin/test')
        .get(users.requiresLogin, admin.checkPermission, admin.listTests)
        .post(users.requiresLogin, admin.checkPermission, admin.createTests);

    app.route('/admin/test/:testId')
        .get(users.requiresLogin, admin.checkPermission, admin.testRead) 
        .post(users.requiresLogin, admin.checkPermission, admin.addQuestion)
        .put(users.requiresLogin, admin.checkPermission, admin.updateTestName)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteTest);

    app.route('/admin/test/:testId/:questionId')
        .put(users.requiresLogin, admin.checkPermission, admin.updateQuestion)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteQuestion);

    app.route('/admin/test/:testId/:questionId/options')
        .post(users.requiresLogin, admin.checkPermission, admin.addOption);
        
    app.route('/admin/test/:testId/:questionId/:optionId')
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteOption);

    //Setting up applicant's cv api
    app.route('/admin/download')
        .get(users.requiresLogin, admin.checkPermission, admin.download);

    // Finish by binding the applicant middleware
    app.param('applicantId', admin.applicantByID);

    // Finish by binding the instructor middleware
    app.param('instructorId', admin.instructorByID);

    // Finish by binding the delete user middleware
    app.param('userId', users.userByID);

    // Finish by binding the bootcamp middleware
    app.param('campId', admin.campByID);

    // Finish by binding the test middleware
    app.param('testId', admin.testByID);

    // Finish by binding the question middleware
    app.param('questionId', admin.questionByID);

    // Finish by binding the placement middleware
    app.param('placementId', admin.placementByID);

    // Finish by binding the skill category middleware
    app.param('skillCategoryId', admin.skillCategoryByID);
    app.param('skillId', admin.skillById);

    // Finish by binding the skill middleware
    app.param('skillId', admin.skillById);
};
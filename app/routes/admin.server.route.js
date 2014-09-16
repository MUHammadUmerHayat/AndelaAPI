'use strict';

/*****
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    admin = require('../../app/controllers/admin'),
    instr = require('../../app/controllers/instructor');


module.exports = function(app) {
    /*** Admin Routes ****/

    //create users
    app.route('/admin/create')
        .post(users.requiresLogin, admin.checkPermission, admin.createUsers);

    
    //delete a user
    app.route('/admin/user/:userId')
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteUser);

    
    //download applicant's cv
    app.route('/admin/download')
        .get(users.requiresLogin, admin.checkPermission, admin.download);
    
    
    //list trainees
    app.route('/admin/trainees')
        .get(users.requiresLogin, admin.checkPermission, admin.listTrainees);

    
    //list applicants
    app.route('/admin/applicants')
        .get(users.requiresLogin, admin.checkPermission, admin.listApplicants);

    
    //list fellows
    app.route('/admin/fellows')
        .get(users.requiresLogin, admin.checkPermission, admin.listFellows);

    
    //list instructors
    app.route('/admin/instructors')
        .get(users.requiresLogin, admin.checkPermission, admin.listInstructors);

    
    //list admins
    app.route('/admin/admins')
        .get(users.requiresLogin, admin.checkPermission, admin.listAdmins);

    
    //change applicant's status and edit applicant's information
    app.route('/admin/applicant/:applicantId')
        .get(users.requiresLogin, admin.checkPermission, admin.applicantRead) 
        .put(users.requiresLogin, admin.checkPermission, admin.changeStatus) 
        .put(users.requiresLogin, admin.checkPermission, admin.updateApplicantDetails);

    
    //change applicant/fellow/trainee role
    app.route('/admin/applicant/:applicantId/role')
        .put(users.requiresLogin, admin.checkPermission, admin.changeRole);
    
    
    //get one particular instructor and change intructor role
    app.route('/admin/instr/:instrId')
        .get(users.requiresLogin, admin.checkPermission, admin.instrRead)  
        .put(users.requiresLogin, admin.checkPermission, admin.changeInstrRole); 
    
    
    /*** for adding placements of fellow and getting all placement history of a 
    particular fellow ***/
    app.route('/admin/fellow/:userId/placements')
        .get(users.requiresLogin, admin.checkPermission, admin.getPlacements)
        .post(users.requiresLogin, admin.checkPermission, admin.addPlacement);

    
    //edit and delete a particular placement as well as edit a particular one
    app.route('/admin/fellow/:userId/placements/:placementId')
        .get(users.requiresLogin, admin.checkPermission, admin.getPlacement) 
        .put(users.requiresLogin, admin.checkPermission, admin.editPlacement)
        .delete(users.requiresLogin, admin.checkPermission, admin.deletePlacement);
    
    
    //create and list bootcamps
    app.route('/admin/camp')
        .get(users.requiresLogin, admin.checkPermission,  admin.bootCamps)
        .post(users.requiresLogin, admin.checkPermission, admin.createBootCamp);
    
   
    //edit and delete a particular bootcamp
    app.route('/admin/camp/:campId')
        .get(users.requiresLogin, admin.checkPermission, admin.read) 
        .put(users.requiresLogin, admin.checkPermission, admin.editCamp)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteCamp);

    
    //create and get skill categories
    app.route('/admin/skillCategories')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkillCategories)
        .post(users.requiresLogin, admin.checkPermission, admin.createSkillCategory);

    
    //edit and delete skill categories
    app.route('/admin/skillCategories/:skillCategoryId')
        .get(users.requiresLogin, admin.checkPermission, admin.getSkillCategory)
        .put(users.requiresLogin, admin.checkPermission, admin.updateSkillCategory)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteSkillCategory);

    
    //Skills API
    app.route('/admin/skills')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkills);

    //create skilla dn list skills by their category
    app.route('/admin/skillCategories/:skillCategoryId/skills')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkillsByCategory)
        .post(users.requiresLogin, admin.checkPermission, admin.createSkill);
    

    //add a skill rating to fellows
    app.route('/admin/trainee/:traineeId/skills/:skillId')
        .put(users.requiresLogin, admin.checkPermission, instr.editFellowRating);

    
    //list and create tests
    app.route('/admin/test')
        .get(users.requiresLogin, admin.checkPermission, admin.listTests)
        .post(users.requiresLogin, admin.checkPermission, admin.createTests);
    

    //add question, delete test, update test's name and get a particular test
    app.route('/admin/test/:testId')
        .get(users.requiresLogin, admin.checkPermission, admin.testRead) 
        .post(users.requiresLogin, admin.checkPermission, admin.addQuestion)
        .put(users.requiresLogin, admin.checkPermission, admin.updateTestName)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteTest);
    

    //update and delete a question
    app.route('/admin/test/:testId/:questId')
        .put(users.requiresLogin, admin.checkPermission, admin.updateQuestion)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteQuestion);

    
    //add option to a particular question
    app.route('/admin/test/:testId/:questId/options')
        .post(users.requiresLogin, admin.checkPermission, admin.addOption);

    
    //delete an option
    app.route('/admin/test/:testId/:questId/:optionId')
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteOption);

   
    // Finish by binding the applicant middleware
    app.param('applicantId', admin.applicantByID);

    // Finish by binding the instructor middleware
    app.param('instrId', admin.instrByID);

    // Finish by binding the user middleware
    app.param('userId', users.userByID);

    // Finish by binding the bootcamp middleware
    app.param('campId', admin.campByID);

    // Finish by binding the test middleware
    app.param('testId', admin.testByID);

    // Finish by binding the question middleware
    app.param('questId', admin.questByID);

    // Finish by binding the placement middleware
    app.param('placementId', admin.placementByID);

    // Finish by binding the skill category middleware
    app.param('skillCategoryId', admin.skillCategoryByID);
    app.param('skillId', admin.skillById);
};
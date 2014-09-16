'use strict';

/*****
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    admin = require('../../app/controllers/admin'),
    instructor = require('../../app/controllers/instructor');


module.exports = function(app) {
    /*** Admin Routes ****/

    // create users
    app.route('/admin/create')
        .post(users.requiresLogin, admin.checkPermission, admin.createUsers);

    
    // delete a user
    app.route('/admin/user/:userId')
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteUser);

    
    // download applicant's cv
    app.route('/admin/download')
        .get(users.requiresLogin, admin.checkPermission, admin.download);
    
    
    // list trainees
    app.route('/admin/trainees')
        .get(users.requiresLogin, admin.checkPermission, admin.listTrainees);

    
    // list applicants
    app.route('/admin/applicants')
        .get(users.requiresLogin, admin.checkPermission, admin.listApplicants);

    
    // list fellows
    app.route('/admin/fellows')
        .get(users.requiresLogin, admin.checkPermission, admin.listFellows);

    
    // list instructors
    app.route('/admin/instructors')
        .get(users.requiresLogin, admin.checkPermission, admin.listInstructors);

    
    // list admins
    app.route('/admin/admins')
        .get(users.requiresLogin, admin.checkPermission, admin.listAdmins);


    /*** Setting up status and role Api ***/

    // change applicant's status and edit applicant's information
    app.route('/admin/applicant/:applicantId')
        .get(users.requiresLogin, admin.checkPermission, admin.applicantRead) 
        .put(users.requiresLogin, admin.checkPermission, admin.changeStatus) 
        .put(users.requiresLogin, admin.checkPermission, admin.updateApplicantDetails);

    
    // change applicant/fellow/trainee role
    app.route('/admin/applicant/:applicantId/role')
        .put(users.requiresLogin, admin.checkPermission, admin.changeRole);
    
    
    // get one particular instructor and change intructor role
    app.route('/admin/instructor/:instructorId')
        .get(users.requiresLogin, admin.checkPermission, admin.instructorRead)  
        .put(users.requiresLogin, admin.checkPermission, admin.changeInstrRole); 
    
    
    /*** Setting up Placements Api ***/

    /* for adding placements of fellow and getting all placement history of a 
       particular fellow 
    */
    app.route('/admin/fellow/:userId/placements')
        .get(users.requiresLogin, admin.checkPermission, admin.getPlacements)
        .post(users.requiresLogin, admin.checkPermission, admin.addPlacement);

    
    // edit and delete a particular placement as well as edit a particular one
    app.route('/admin/fellow/:userId/placements/:placementId')
        .get(users.requiresLogin, admin.checkPermission, admin.getPlacement) 
        .put(users.requiresLogin, admin.checkPermission, admin.editPlacement)
        .delete(users.requiresLogin, admin.checkPermission, admin.deletePlacement)

    
    /*** Setting up Camp Api ***/

    // create and list bootcamps
    app.route('/admin/camp')
        .get(users.requiresLogin, admin.checkPermission,  admin.bootCamps)
        .post(users.requiresLogin, admin.checkPermission, admin.createBootCamp);
    
   
    // edit and delete a particular bootcamp
    app.route('/admin/camp/:campId')
        .get(users.requiresLogin, admin.checkPermission, admin.read) 
        .put(users.requiresLogin, admin.checkPermission, admin.editCamp)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteCamp);


    /*** Setting up Skills Api ***/
    
    // create and get skill categories
    app.route('/admin/skillCategories')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkillCategories)
        .post(users.requiresLogin, admin.checkPermission, admin.createSkillCategory);


    // edit and delete skill categories
    app.route('/admin/skillCategories/:skillCategoryId')
        .get(users.requiresLogin, admin.checkPermission, admin.getSkillCategory)
        .put(users.requiresLogin, admin.checkPermission, admin.updateSkillCategory)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteSkillCategory);
    

    // list skills
    app.route('/admin/skills')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkills);

    // create skill and list skills by their category
    app.route('/admin/skillCategories/:skillCategoryId/skills')
        .get(users.requiresLogin, admin.checkPermission, admin.listSkillsByCategory)
        .post(users.requiresLogin, admin.checkPermission, admin.createSkill);
    
    
    // edit a fellow's skill rating
    app.route('/admin/trainee/:traineeId/skills/:skillId')
        .put(users.requiresLogin, admin.checkPermission, instructor.editFellowRating);

    
    /*** Setting up Test Api ***/

    // list all tests and create a test
    app.route('/admin/test')
        .get(users.requiresLogin, admin.checkPermission, admin.listTests)
        .post(users.requiresLogin, admin.checkPermission, admin.createTests);
    

    // add question, delete test, update test's name and get a particular test
    app.route('/admin/test/:testId')
        .get(users.requiresLogin, admin.checkPermission, admin.testRead) 
        .post(users.requiresLogin, admin.checkPermission, admin.addQuestion)
        .put(users.requiresLogin, admin.checkPermission, admin.updateTestName)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteTest);


    // update and delete a question
    app.route('/admin/test/:testId/:questionId')
        .put(users.requiresLogin, admin.checkPermission, admin.updateQuestion)
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteQuestion);

    
    // add option to a particular question
    app.route('/admin/test/:testId/:questionId/options')
        .post(users.requiresLogin, admin.checkPermission, admin.addOption);

    
    // delete an option
    app.route('/admin/test/:testId/:questionId/:optionId')
        .delete(users.requiresLogin, admin.checkPermission, admin.deleteOption);


    // Finish by binding the applicant middleware
    app.param('applicantId', admin.applicantByID);

    
    // Finish by binding the instructor middleware
    app.param('instructorId', admin.instructorByID);

   
    // Finish by binding the user middleware
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

    
    // Finish by binding the skill middleware
    app.param('skillId', admin.skillById);
};
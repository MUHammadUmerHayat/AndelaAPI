'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Instructor = mongoose.model('Instructor'),
    Applicant = mongoose.model('Applicant'),
    User = mongoose.model('User'),
    Bootcamp = mongoose.model('Bootcamp'),
    SkillCategory = mongoose.model('SkillCategory'),
    Skill = mongoose.model('Skill'),
    _ = require('lodash');

var users = require('../../app/controllers/users');

var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    async = require('async');

var path = require('path'),
    fs = require('fs');


/*
*Return json object of particular applicant/trainee/fellow 
*/
exports.returnJson = function(res, id) {
    Applicant.findById(id).where({_type: 'Applicant'}).populate('skillSet.skill').exec(function(err, user) {
        console.log(user);
       res.jsonp(user);
    });
};

/*
*Return json object of particular bootcamp
*/
exports.jsonCamp = function(res, id) {
    Bootcamp.findById(id).exec(function(err, camp) {
       res.jsonp(camp);
    });
};

/*
*Return json object of instructor
*/
var jsonInstructor = function(res, id) {
    Instructor.findById(id).exec(function(err, instructor) {
        console.log(instructor);
       res.jsonp(instructor);
    });
};

/**
*Input assessment score for trainee
*/
exports.createAssmt = function(req, res){
    req.body.instructorId = req.user.id;
    req.body.applicantId = req.trainee._id;
    
    Applicant.update(
      { 
        _id: req.trainee._id, 
      },
      { $push: { 
        "assessments": req.body }
      },
      function(err) {
          if (err) {
<<<<<<< HEAD
             res.send(500, { message: err });
=======
             return res.send(400, {message: err });
>>>>>>> feature/userserver
          } else {
             exports.returnJson(res, req.trainee._id);
          }
      }
    );
};

/*
*Update assessment
*/
exports.updateAssmt = function(req, res) {
    var assessment = req.assessment,
        trainee = req.trainee;

    assessment = _.extend(assessment , req.body);
    Applicant.update({_id: trainee._id, 'assessments._id': assessment._id}, 
          {$set: 
              {  'assessments.$.assessment_name' : assessment.assessment_name,
                 'assessments.$.assessment_date' : assessment.assessment_date, 
                 'assessments.$.score ': req.body.score
              }

          }, 
          function(err) {
              if (err) {
<<<<<<< HEAD
                 res.send(500, { message: err });
=======
                 return res.send(400, { message: err });
>>>>>>> feature/userserver
              } else {
                 exports.returnJson(res, trainee._id);
              }
          }
    );
};

/*
*delete an assessment
*/
exports.deleteAssmt = function(req, res) {
    var assessment = req.assessment,
        trainee = req.trainee;

    Applicant.update(
        { '_id': trainee._id }, 
        { $pull: { 'assessments': { '_id': assessment._id } }  
        }, function (err) {
            if (err) {
<<<<<<< HEAD
                res.send(500, {
                    message: 'error occurred while trying to delete assessment'
                });
            } else {
=======
                return res.send(400, {
                    message: 'error occurred while trying to delete assessment'
                });
            } else {
                //res.jsonp(trainee);
>>>>>>> feature/userserver
                exports.returnJson(res, trainee._id);
            }
        }
    );
};

/*
*Select a fellow
*/
exports.selectFellow = function(req, res){
      var trainee = req.trainee,
          role = req.body.role;
      trainee = _.extend(trainee, req.body);

      if (role === 'applicant' || role === 'admin' || role === 'instructor') {
         res.send(400, {
              message: 'Error: action couldn\'t be carried out'
         });
      } else {
            Applicant.update({_id: trainee._id}, 
              {$set: 
                  { 'role' : role }
<<<<<<< HEAD
              }, 
              function(err) {
                  if (err) {
                     res.send(500, { message: 'could not change applicant role' });
                  } else {
=======

              }, 
              function(err) {
                  if (err) {
                     return res.send(400, {message: 'could not change applicant role' });
                  } else {
                     //res.jsonp(trainee);
>>>>>>> feature/userserver
                     exports.returnJson(res, trainee._id);
                  }
              }
            ); 
      }
};

/*
*Rate a fellow's skill
*/
exports.editFellowRating = function(req, res) {
    var skill = {skill: req.skill, rating: req.body.rating},
        fellow = req.trainee;
    var skillSummary;

    SkillCategory.find().exec(function(err, data){
        var categories = data;
        var categoriesLength = categories.length;
        var skillSummary = {};

        for(var i = 0; i < categoriesLength; i++){
            //find all skills with category and calculate average
            var averageRating = 0,
                sumRating     = 0,
                numRating     = 0;

            for(var j = 0; j < fellow.skillSet.length; j++){
                if(categories[i]._id.toString() === fellow.skillSet[j].skill.category.toString()){
                    if(req.skill._id.toString() === fellow.skillSet[j].skill._id.toString()){
                        numRating ++;
                        sumRating = sumRating + parseInt(req.body.rating);
                    }
                    else{
                        numRating ++;
                        sumRating = sumRating + parseInt(fellow.skillSet[j].rating);
                    }
                }
            }

            averageRating = sumRating / numRating;
            skillSummary[categories[i].name] = averageRating;
        }

        if (fellow.role !== 'fellow') {
<<<<<<< HEAD
            res.send(400, {
                   message: 'Error: You can only rate a fellow\'s skills'
            });
        } else if (req.body.rating < 0 || req.body.rating > 10) {
            res.send(400, {
=======
        return res.send(400, {
               message: 'Error: You can only rate a fellow\'s skills'
        });
        } else if (req.body.rating < 0 || req.body.rating > 10) {
            return res.send(400, {
>>>>>>> feature/userserver
                   message: 'Error: rating is a 10 point system'
            });
        } else {
            Applicant.update(
                 {_id: fellow._id, 'skillSet.skill': req.skill._id},
                 {$set: { 
                          'skillSet.$.rating': req.body.rating,
                          'skillSummary':  skillSummary
                        } 
                 },
                 function (err, changes) {
                     if (err) {
<<<<<<< HEAD
                        res.send(500, { message: 'error occurred trying to update skill rating' });
=======
                        return res.send(400, { message: 'error occurred trying to update skill rating' });
>>>>>>> feature/userserver
                     } else {
                         exports.returnJson(res, fellow._id);
                     }
                 }
            );
<<<<<<< HEAD
        }   
    }); 
=======
        }

        
    });
    
>>>>>>> feature/userserver
};

/*
*Instructor adds his own skillset
*/
exports.addSkills = function(req, res) {
    var skill = req.body;
    User.findById(req.user._id).exec(function(err, user) {
        if (user._type === 'Instructor') {
             Instructor.update(
                { _id: user._id }, 
                { $push: { 'skillSets':  skill }
                }, 
                function (err) {
                    if (err) {
<<<<<<< HEAD
                        res.send(500, {
                            message: 'Error: Couldn\'t add skill'
                        });
                    } else {
=======
                        return res.send(400, {
                            message: 'Error: Couldn\'t add skill'
                        });
                    } else {
                        //res.jsonp(user);
>>>>>>> feature/userserver
                        exports.returnJson(res, req.user._id);
                    }
                }
             );
        } else {
<<<<<<< HEAD
            res.send(403, {
=======
            return res.send(400, {
>>>>>>> feature/userserver
                    message: 'Error: You are not authorized to carryout this operation'
            });
        }
    });
};


/**
 * Show the current trainee/fellow
 */
exports.readTrainee = function(req, res) {
    res.jsonp(req.trainee);
};

/**
 * Upload image
 */
var uploadImage = function(req, res, contentType, tmpPath, destPath, person, experience) {
    
    // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
        fs.unlink(tmpPath);
        res.send(415, { 
            message: 'Unsupported file type. Only jpeg or png format allowed' 
        });
    } else {
        async.waterfall([
            function (callback) {
                fs.readFile(tmpPath , function (err, data) { 
                    if (err) {
                        var message = 'temp path doesn\'t exist.';
                        return callback(message);
                    } 
                    callback(null, data);
                });
            },
            function (data, callback) { 
                fs.writeFile(destPath, data, function(err, data) {
                    if (err) {
                        var message = 'Destination path doesn\'t exist.';
                        return callback(message);
                    }
                    callback();
                });
            },
            function (callback) {
                fs.unlink(tmpPath);
                var path =  person.photo;

                if (fs.existsSync(path)) {
                    fs.unlink(path);
                }

                Instructor.update(
                     {_id: person._id},
                     {$set: { photo: destPath, experience: experience } },
                      function (err, user) {
                         if (err) {
                            var message = 'Error: save operation failed';
                            return callback(message);
                         } 
                         callback();
                      }
                );
            }
        ],
        function(err, results) {
            if (err) {
                res.send(400, { message: err });
            } else {
                jsonInstructor(res, person._id);    
            }
        });
    }
};

/**
 * Instructor updates experience and photo
 */
exports.updateInfo = function(req, res) {
    //Parse Form
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        User.findById(req.user.id).exec(function(err, person) {
            if (err) {
               res.send(500, { message: err });
            } else if (!person) {
               res.send(500, { message: 'Failed to load User ' + person._id });
            } else {
                var experience = '';
                if (fields.exp) {
                    experience = fields.exp[0];
                } 
        
                if (files.file) {
                    //if there is a file do upload
                    var file = files.file[0],     
                        contentType = file.headers['content-type'],
                        tmpPath = file.path,      
                        extIndex = tmpPath.lastIndexOf('.'),
                        extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);

                    // uuid is for generating unique filenames. 
                    var fileName = uuid.v4() + extension,
                        destPath =  'public/modules/core/img/server/Temp/' + fileName;
                         
                    uploadImage(req, res, contentType, tmpPath, destPath, person, experience);
                } else {
                    Instructor.update(
                         {_id: person._id},
                         {$set: { experience: experience } },
                          function (error) {
                             if (error) {
                                res.send(500, { message: 'Error: save operation failed' });
                             } else {
                                 exports.returnJson(res, person._id);
                             }
                          }
                    );
                }
            }
        });
    });
};

/**
 * Delete photo 
 */
exports.deletePhoto = function(req, res) {
    var profile = req.profile;

    if (fs.existsSync(profile.photo)) {
        fs.unlink(profile.photo);
    } 

    Instructor.update(
         {_id: profile._id},
         {$set: { photo: '' } },
          function (error) {
             if (error) {
                 res.send(500, { message: 'Error: save operation failed' });
             } else {
                 exports.returnJson(res, profile._id);
             }
          }
    );
};

/***************************************   MIDDLEWARE   *****************************************/

/**
* Particular trainee middleware
*/
exports.traineeByID = function(req, res, next, id){   
    Applicant.findById(id).where({_type: 'Applicant'}).populate('campId').populate('skillSet.skill').exec(function(err, trainee) {
        if (err) return next(err);
        if (!trainee) return next(new Error('Failed to load trainee ' + id));
        req.trainee = trainee;
        next();
    });
};


/**
* Particular assessment middleware
*/
exports.assessmentByID = function(req, res, next, id){   
    req.assessment = req.trainee.assessments.id(id);
    next();
};

/**
* Check if he is the creator of the assessment middleware
*/
exports.isCreator = function(req, res, next){ 
    if (req.assessment.instructorId.toString() !== req.user.id) {
<<<<<<< HEAD
       res.send(400, { message: 'You are not the creator of the assessment' }); 
=======
       return res.send(403, 'User is not authorized'); 
>>>>>>> feature/userserver
    }
    next();
};

/**
 * Instructor authorization middleware
 */
exports.checkRights = function(req, res, next) { 
    if (req.user._type === 'Instructor' && req.user.role === 'instructor') {
        next();
    } else {
        res.send(403, {
              message: 'You are not an Instructor'
        });
    }
};
<<<<<<< HEAD
=======

/**
 * Upload image
 */
var uploadImage = function(req, res, contentType, tmpPath, destPath, person, experience) {
    
    // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
        fs.unlink(tmpPath);
        return res.send(400, { 
            message: 'Unsupported file type. Only jpeg or png format allowed' 
        });
    } else {
        fs.readFile(tmpPath , function(err, data) {
            fs.writeFile(destPath, data, function(err) {
                if (err) {
                   return res.send(400, { message: 'Destination path doesn\'t exist.' });
                }
                else {
                   fs.unlink(tmpPath, function(){
                        var path =  person.photo;

                        if (fs.existsSync(path)) {
                            fs.unlink(path);
                        }

                        Instructor.update(
                             {_id: person._id},
                             {$set: { photo: destPath, experience: experience } },
                              function (error, user) {
                                 if (error) {
                                    return res.send(400, { message: 'Error: save operation failed' });
                                 } else {
                                     //res.jsonp(user);
                                     exports.returnJson(res, person._id);
                                 }
                              }
                        );
                   });
                }
            }); 
        });
    }
};


/**
 * Instructor updates experience and photo
 */
exports.updateInfo = function(req, res) {
    //Parse Form
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        User.findById(req.user.id).exec(function(err, person) {
            if (err) {
               return res.send(400, { message: err });
            } else if (!person) {
                return res.send(400, { message: 'Failed to load User ' + person._id });
            } else {
                var experience = '';
                if (fields.exp) {
                    experience = fields.exp[0];
                } 
        
                if (files.file) {
                    //if there is a file do upload
                    var file = files.file[0],     contentType = file.headers['content-type'],
                        tmpPath = file.path,      extIndex = tmpPath.lastIndexOf('.'),
                        extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);

                    // uuid is for generating unique filenames. 
                    var fileName = uuid.v4() + extension;
                    
                    var destPath =  'public/modules/core/img/server/Temp/' + fileName;
                         
                    uploadImage(req, res, contentType, tmpPath, destPath, person, experience);
                } else {
                    Instructor.update(
                         {_id: person._id},
                         {$set: { experience: experience } },
                          function (error, user) {
                             if (error) {
                                return res.send(400, { message: 'Error: save operation failed' });
                             } else {
                                 //res.jsonp(user);
                                 exports.returnJson(res, person._id);
                             }
                          }
                    );
                }
            }
        });
    });
};

/**
 * Delete photo 
 */
exports.deletePhoto = function(req, res) {
    var profile = req.profile;

    if (fs.existsSync(profile.photo)) {
        fs.unlink(profile.photo);
    } 

    Instructor.update(
         {_id: profile._id},
         {$set: { photo: '' } },
          function (error) {
             if (error) {
                return res.send(400, { message: 'Error: save operation failed' });
             } else {
                 //res.jsonp(user);
                 exports.returnJson(res, profile._id);
             }
          }
    );
};
>>>>>>> feature/userserver

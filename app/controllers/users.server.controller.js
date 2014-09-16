'use strict';

/**
 * Module dependencies.
 */
var mongoose        = require('mongoose'),
    passport        = require('passport'),
    User            = mongoose.model('User'),
    Applicant       = mongoose.model('Applicant'),
    Bootcamp        = mongoose.model('Bootcamp'),
    Placement       = mongoose.model('Placement'),
    Test            = mongoose.model('Test'),
    _               = require('lodash');

var admin = require('../../app/controllers/admin');

var uuid = require('node-uuid'),
    multiparty = require('multiparty');

var path = require('path'),
    fs = require('fs');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    return message;
};

/**
*   CV Upload
*
*/

var uploadCV = function(req, res, contentType, tmpPath, destPath) {
        // Server side file type checker.
        if (contentType !== 'application/msword' && contentType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && contentType !== 'application/pdf') {
            fs.unlink(tmpPath);
            console.log('contenttypefail');
            return res.status(400).send('Unsupported file type.');
        }

        fs.readFile(tmpPath , function(err, data) {
            fs.writeFile(destPath, data, function(err) {
                    
                fs.unlink(tmpPath, function(){
                    if(err) {
                        console.log('CV not saved error');
                        console.log(err);
                        throw err;
                    }
                });
            }); 
        });
};


exports.signup = function(req, res) {
    console.log('Request from Applicant');
    console.log('req: ' + req);
        //Parse Form
       var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            if(err){
                console.log('error parsing form');
                console.log(err);
            } 

            var user = { firstName: fields.firstName[0], lastName: fields.lastName[0], 
                             password: fields.password[0], email: fields.email[0], 
                             username: fields.username[0], testScore: fields.testScore[0], role: fields.type[0]  }


            console.log('test score:'+ fields.testScore[0]);
            console.log('role:' + fields.type[0]);
            

        if (user.role === 'applicant') {
            user = new Applicant(user);
            
            user.campId = req.camp._id;
            console.log(user.campId);

            if(files.file[0]){
                    //if there is a file do upload
                    console.log(files);
                    var file = files.file[0];
                    console.log(file);
                    var contentType = file.headers['content-type'];
                    var tmpPath = file.path;
                    var extIndex = tmpPath.lastIndexOf('.');
                    var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
                    var destPath =  path.resolve('public/modules/core/img/server' + tmpPath);           
            }
        

            var message = null;
            user.provider = 'local';
            console.log(req.camp);
            console.log(typeof req.camp);
            req.camp.applicants.push(user);

            user.cvPath = destPath;
                user.status.name = 'pending';
                user.status.reason = '';
                
            req.camp.save(function(err) {
                if (err) {
                    return res.send(400, {
                        message: err
                    });
                } 
                else {
                    uploadCV(req, res, contentType, tmpPath, destPath, user);
                    user.save(function(err) {
                    if (err) {
                        console.log('Error');
                    } 
                    else {
                        req.login(user, function(err) {
                            if (err) {
                                res.send(400, err);
                            } 
                            else {
                                user.password = undefined;
                                user.salt = undefined;
                                res.jsonp(user);

                            }
                       });
                    }
                });
                }
            });
         }
      });
    
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
    console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.send(400, info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.jsonp(user);
                }
            });
        }
    })(req, res, next);
};

/**
 * Check unique username
 */
exports.uniqueUsername = function(req, res) {
    console.log(req.body);
    User.find().where({username: req.body.username}).exec(function(err, user) {
         if (err) {
             return res.send(401, {
                message: err
             });
         } else if (!user) {
              return res.send(401, {
                message: 'unknown user'
             });
         } else {
             res.jsonp(user);
         }
       });
};

/**
 * Update user details
 */
exports.update = function(req, res) {
    // Init Variables
    var user = req.user;
    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;

        user.save(function(err) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.send(400, err);
                    } else {
                        res.jsonp(user);
                    }
                });
            }
        });
    } else {
        res.send(400, {
            message: 'User is not signed in'
        });
    }
};


exports.adminUpdate = function(req, res) {
    // Init Variables
    var user = req.profile;

    var message = null;

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    if (user) {
        // Merge existing user
        user = _.extend(user, req.body);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;

        user.save(function(err) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(user);
            }
        });
    } else {
        res.send(400, {
            message: 'User update failed'
        });
    }
};


 exports.getCamp = function(req, res) {
    res.jsonp(req.camp);
 };

exports.getCamps = function(req, res) {  
    Bootcamp.find().sort('-start_date').exec(function(err, bootcamps) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            console.log(bootcamps);
            res.jsonp(bootcamps);
        }
    });
};

exports.list = function(req, res) { 
    Applicant.find().where({role: 'fellow'}).populate('user', 'displayName').exec(function(err, fellows) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(fellows);
        }
    });
};

// viewing Applicants data page
exports.applicantView = function(req, res, id) { 
    var user = req.user;
    var message = null;
    id = req.user._id;

    if (user) {
            User.findById(id).populate('user', 'displayName').exec(function(err, users) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                    req.login(user, function(err) {
                        if (err) {
                            res.send(400, err);
                        } else {
                            res.jsonp(users);
                        }
                });
            }
        });
    } else {
        res.send(400, {
            message: 'You need to Sign in to view your application progress'
        });
    }
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
    // Init Variables
    var passwordDetails = req.body;
    var message = null;

    if (req.user) {
        User.findById(req.user.id, function(err, user) {
            if (!err && user) {
                if (user.authenticate(passwordDetails.currentPassword)) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;

                        user.save(function(err) {
                            if (err) {
                                return res.send(400, {
                                    message: getErrorMessage(err)
                                });
                            } else {
                                req.login(user, function(err) {
                                    if (err) {
                                        res.send(400, err);
                                    } else {
                                        res.send({
                                            message: 'Password changed successfully'
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.send(400, {
                            message: 'Passwords do not match'
                        });
                    }
                } else {
                    res.send(400, {
                        message: 'Current password is incorrect'
                    });
                }
            } else {
                res.send(400, {
                    message: 'User is not found'
                });
            }
        });
    } else {
        res.send(400, {
            message: 'User is not signed in'
        });
    }
};

/**
 * Signout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
    return function(req, res, next) {
        passport.authenticate(strategy, function(err, user, redirectURL) {
            if (err || !user) {
                return res.redirect('/#!/signin');
            }
            req.login(user, function(err) {
                if (err) {
                    return res.redirect('/#!/signin');
                }

                return res.redirect(redirectURL || '/');
            });
        })(req, res, next);
    };
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
    Applicant.findById(id).populate('placements').sort('-placements.end_date').exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        Placement.populate(user.placements, { path:'placement'},
            function(err, data) {
                req.profile = user;
                next();
            }
        );
        
    });
};

exports.read = function(req, res) {
    res.jsonp(req.profile);
};


exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, {
            message: 'User is not logged in'
        });
    }

    next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
    var _this = this;

    return function(req, res, next) {
        _this.requiresLogin(req, res, function() {
            if (_.intersection(req.user.roles, roles).length) {
                return next();
            } else {
                return res.send(403, {
                    message: 'User is not authorized'
                });
            }
        });
    };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
    if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function(err, user) {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // And save the user
                        user.save(function(err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        var user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) user.additionalProvidersData = {};
            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(function(err) {
                return done(err, user, '/#!/settings/accounts');
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
    var user = req.user;
    var provider = req.param('provider');

    if (user && provider) {
        // Delete the additional provider
        if (user.additionalProvidersData[provider]) {
            delete user.additionalProvidersData[provider];

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');
        }

        user.save(function(err) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        res.send(400, err);
                    } else {
                        res.jsonp(user);
                    }
                });
            }
        });
    }
};

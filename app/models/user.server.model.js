'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    extend = require('mongoose-schema-extend'),
    Schema = mongoose.Schema,
    moment = require('moment'),
    crypto = require('crypto');


/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    username: {
        type: String,
        required: 'Please fill in a username',
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required',
    },
    providerData: {},
    additionalProvidersData: {},
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'users',
    discriminatorKey: '_type'
});

/**
 * SkillCategory Schema
 */
var SkillCategorySchema = new Schema({
    name: {
        type: String,
        required: 'Name of skill category is important'
    }
});

/**
 * Skill Schema
 */
var SkillSchema = new Schema({
    name: {
        type: String
    },
    category: {
        type: Schema.ObjectId,
        ref: 'SkillCategory'
    },
});

/**
 * Assessment Schema
 */
var AssessmentSchema = new Schema({
    assessment_name: {
        type: String,
        trim: true,
        required: 'Name of assessment is important'
    },
    assessment_date: {
        type: Date,
        required: 'Date of assessment is important'
    },
    applicantId: {
        type: Schema.ObjectId,
        ref: 'Applicant'
    },
    instructorId: {
        type: Schema.ObjectId,
        ref: 'Instructor'
    },
    score: {
        type: Number,
        required: 'The Applicant score is compulsory'
    }

});

/**
 * Placement Schema
 */
var PlacementSchema = new Schema({
    company: {
        type: String,
        trim: true,
        required: 'Name of company is important'
    },
    jobDescription: {
        type: String,
        required: 'Job description is important'
    },
    start_date: {
        type: Date,
        required: 'Start date is important'
    },
    end_date: {
        type: Date,
        required: 'End date is important'
    }

});

/**
 *
 * Applicant Schema, Trainee and Fellow
 */
var ApplicantSchema = UserSchema.extend({
    testScore: {
        type: Number,
        required: 'Applicant score must be submitted'
    },
    cvPath: {
        type: String
    },
    photo_path: String,
    role: {
        type: String,
        enum: ['applicant', 'trainee', 'fellow']
    },
    status: {
        name: {
            type: String,
            enum: ['pending', 'rejected', 'selected for bootcamp', 'selected for interview'],
            default: 'pending'
        },
        reason: {
            type: String,
            default: ''
        }
    },
    portfolio: {
        type: String
    },
    skillSet: [{
        skill: {
            type: Schema.Types.ObjectId,
            ref: 'Skill'
        },
        rating: {
            type: Number
        }
    }],
    skillSummary: {},
    profile: {
        type: String
    },
    campId: {
        type: Schema.ObjectId,
        ref: 'Bootcamp'
    },
    assessments: [AssessmentSchema],
    placements: [{
        type: Schema.Types.ObjectId,
        ref: 'Placement'
    }]
});

/**
 * Instructor Schema
 */
var InstructorSchema = UserSchema.extend({
    experience: {
        type: String
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['instructor', 'admin']
    },
    skillSet: [SkillSchema]
});


/**
 * Bootcamp Schema
 */
var BootcampSchema = new Schema({
    camp_name: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        required: 'Please fill in the Bootcamp location',
        default: 'Lagos',
        trim: true
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'Applicant'
    }]
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

ApplicantSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        if (this.constructor.name === 'EmbeddedDocument') {
            var TempApplicant = mongoose.model('Applicant');
            var embeddedDocApplicant = new TempApplicant(this);
            this.password = embeddedDocApplicant.hashPassword(this.password);
        } else {
            this.password = this.hashPassword(this.password);
        }
    }

    next();
});

InstructorSchema.pre('save', function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    next();
});

BootcampSchema.pre('save', function(next) {
    if (this.start_date && this.location) {
        this.camp_name = moment(this.start_date).format('MMMM D, YYYY') + ', ' + this.location;
    }
    next();

});

SkillSchema.post('save', function(next) {
    var skill = this;
    var Applicant = mongoose.model('Applicant');
    Applicant.find().exec(function(err, applicants) {
        applicants.forEach(function(applicant) {
            Applicant.update({
                _id: applicant._id
            }, {
                $push: {
                    'skillSet': {
                        skill: skill._id,
                        rating: 0
                    }
                }
            }, function(err) {
                if (err) {
                    return {
                        message: 'Couldn\'t add skill to applicant'
                    };
                }
            });
        });
    });
});

ApplicantSchema.post('save', function(next) {
    var applicant = this;
    var Skill = mongoose.model('Skill');
    var Applicant = mongoose.model('Applicant');
    //Initialize skill summary
    var SkillCategory = mongoose.model('SkillCategory');
    var skillSummary = {};
    SkillCategory.find().exec(function(err, skillCategories) {
        skillCategories.forEach(function(category) {
            skillSummary[category.name] = 0;
        });
        Skill.find().exec(function(err, skills) {
            skills.forEach(function(skill) {
                Applicant.update({
                    _id: applicant._id
                }, {
                    $push: {
                        'skillSet': {
                            skill: skill._id,
                            rating: 0
                        }
                    },
                    $set: {
                        'skillSummary': skillSummary
                    }
                }, function(err) {
                    if (err) {
                        return {
                            message: 'Couldn\'t add skill to applicant'
                        };
                    }
                });
            });
        });
    });
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

ApplicantSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

InstructorSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

ApplicantSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

InstructorSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

ApplicantSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

InstructorSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

mongoose.model('Placement', PlacementSchema);
mongoose.model('User', UserSchema);
mongoose.model('Applicant', ApplicantSchema);
mongoose.model('Instructor', InstructorSchema);
mongoose.model('Bootcamp', BootcampSchema);
mongoose.model('SkillCategory', SkillCategorySchema);
mongoose.model('Skill', SkillSchema);
mongoose.model('Assessment', AssessmentSchema);

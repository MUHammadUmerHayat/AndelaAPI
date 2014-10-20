'use strict';

/**
 * Module dependencies.
 */
var mongoose 		= require('mongoose'),
	Test 			= mongoose.model('Test'),
	User 			= mongoose.model('User'),
	Applicant 		= mongoose.model('Applicant'),
	Bootcamp 		= mongoose.model('Bootcamp'),
    _ 				= require('lodash');

/**
 * Show the current Test
 */
exports.read = function(req, res) {
	res.jsonp(req.test);
};

exports.list = function(req, res) {
	Test.find().sort('-created').populate('user', 'displayName').exec(function(err, test) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(test);
		}
	});
};

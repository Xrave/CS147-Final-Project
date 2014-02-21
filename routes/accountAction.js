// JavaScript Document// Get all of our friend data
var mongoose = require('mongoose');
var models = require('../models')

exports.process = function(req, res){
	if (!req.user) {
		throw new Error('user null');
	}
	console.log('-------USER REQUEST FROM-------');
		console.log(req.user);

	
	if(req.query.state == 'newaccount'){
	  //create a family for it.
	  	var json = {
						"controllers":[ 
						req.user.displayName],
						"controlees":[   ],
						"tasks":[],
						"rewards":[],
						"notifications":[]		};
			var newFamily = new models.Family(json);
			newFamily.save(function(err, newFamily){
			console.log(newFamily + " is saved!");
		});		
	} else if (req.query.state == "adding_child")
	{
	  var familyID = req.query.family;
	  
	} else if (req.query.state == "adding_parent")
	{
	  var familyID = req.query.family;
	  
	}
	res.redirect("/");
}
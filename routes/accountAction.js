// JavaScript Document// Get all of our friend data
var mongoose = require('mongoose');
var models = require('../models')

exports.process = function(req, res){
	
	console.log('-------USER REQUEST FROM-------');
	console.log(req.body);
	console.log('-------------------------------');
	
	/*{ name: 'Xiaonan',
  email: 'xiaonan@stupid.place',
  password: 'password', points:-1 }*/

	//TODO: check if account exists already. meh.
	
	var userJson = req.body;
	var newUser = new models.Person(userJson);
	
	newUser.save(function(err, newUser){
		console.log(newUser + " is saved!");
		res.send(200);
	});
	
	if(req.query.state == 'newaccount'){
	  //create a family for it.
	  	/*var json = {
						"controllers":[ 
						req.user.displayName],
						"controlees":[   ],
						"tasks":[],
						"rewards":[],
						"notifications":[]		};
			var newFamily = new models.Family(json);
			newFamily.save(function(err, newFamily){
			console.log(newFamily + " is saved!");
		});*/
	} 
	else if (req.query.state == "adding_child")
	{
	  	var familyID = req.query.family;
	  
	} 
	else if (req.query.state == "adding_parent")
	{
	  	var familyID = req.query.family;
	  
	}
}
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
	
	if(req.query.action == 'signUp'){
		var userJson = req.body;
		var newUser = new models.Person(userJson);
		newUser.save(function(err, newUser){
			console.log(newUser + " is saved!");
			console.log("now creating family for new user");
			var json = {
						"controllers":[ 
						newUser.email],
						"controlees":[   ],
						"tasks":[],
						"rewards":[],
						"notifications":[]		};
			var newFamily = new models.Family(json);
			newFamily.save(function(err, newFamily){
				console.log(newFamily + " is saved!");
				res.cookie('family', newFamily._id);
				res.send(200);
			});
			res.cookie('user', newUser.email);
		});
	}else if(req.query.action == 'signIn'){
		var userJson = req.body;
		models.Person
		.find(userJson)
		.exec(function(err, entry){
			if(err) console.log(err);
			if(entry){
				models.Family
				.find({$or: [{controllers:entry[0].email}, {controlees:entry[0].email}] })
				.exec(function(err, matchedFamilies){
					res.cookie('family', matchedFamilies[0]._id);
					res.send(200);

				});
				console.log("\t"+entry[0].name + " Logged in!");
				res.cookie('user', entry[0].email);
			}else{
				res.send(500);
			}
		});
	}else if(req.query.action == 'addNewChild'){
		var userJson = req.body;
		var newUser = new models.Person(userJson);
		newUser.save(function(err, newUser){
			console.log("[ NEW CHILD ADDED ]");
			console.log(newUser + " is saved!");
			//res.cookie('user', newUser.email);
			//res.send(200);
		});


	}else if(req.query.action == 'addNewParent'){
		var userJson = req.body;
		var newUser = new models.Person(userJson);
		newUser.save(function(err, newUser){
			console.log("[ NEW PARENT ADDED ]");
			console.log(newUser + " is saved!");
			//res.cookie('user', newUser.email);
			//res.send(200);
		});

	}
	
	
	
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
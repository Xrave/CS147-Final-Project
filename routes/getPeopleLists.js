// JavaScript Document

var models = require("../models");

exports.getChildrenList = function(req, res){
	console.log(req.cookies);
	if(!req.cookies.user || !req.cookies.family){
		res.redirect('/login');
		return;
	}

 	models.Family
    .find({"_id": req.cookies.family})
    .exec(function(err, families){
		if(err) {console.log(err); res.json([]); return; }
		if(!families[0]){
			res.json({});
			return;
		}
		var kids = families[0].controlees;
		var childrenOut = {"child":[]};
		var index;
		var callbacksfinished = 0;
		if(kids.length == 0){
			res.json(childrenOut['child']);
			return;
		}

		for(index = 0; index<kids.length; index++){
			var email = kids[index]; //email of the kid
			console.log(email)
			var i = index;
			models.Person
			.find({"email": email})
			.exec(function(err, people){
				childrenOut.child.push({"name":people[0].name, "email":people[0].email});
				callbacksfinished ++;
				if(callbacksfinished == kids.length){
					res.json(childrenOut['child']);
					return;
				}
			});
		};
		
	});
}


exports.getParentsList = function(req, res){
	console.log(req.cookies);
	if(!req.cookies.user || !req.cookies.family){
		res.redirect('/login');
		return;
	}

 	models.Family
    .find({"_id": req.cookies.family})
    .exec(function(err, families){
		if(err) {console.log(err); res.json([]); return; }
		if(!families[0]){
			res.json([]);
			return;
		}
		var kids = families[0].controllers;
		var childrenOut = {"child":[]};
		var index;
		var callbacksfinished = 0;
		if(kids.length == 0){
			res.json(childrenOut['child']);
			return;
		}

		for(index = 0; index<kids.length; index++){
			var email = kids[index]; //email of the kid
			console.log(email)
			var i = index;
			models.Person
			.find({"email": email})
			.exec(function(err, people){
				childrenOut.child.push({"name":people[0].name, "email":people[0].email});
				callbacksfinished ++;
				if(callbacksfinished == kids.length){
					res.json(childrenOut['child']);
					return;
				}
			});
		};
		
	});
}
// JavaScript Document

var models = require("../models");

exports.getChildrenList = function(req, res){
	console.log(req.session);
	if(!req.session.user || !req.session.family){
		res.redirect('/login');
		return;
	}

 	models.Family
    .find({"_id": req.session.family})
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
	console.log(req.session);
	if(!req.session.user || !req.session.family){
		res.redirect('/login');
		return;
	}

 	models.Family
    .find({"_id": req.session.family})
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

exports.getConfirmRequests = function(req,res){
	
	function getObjects(obj, key, val) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(getObjects(obj[i], key, val));
			} else if (i == key && obj[key] == val) {
				objects.push(obj);
			}
		}
		return objects;
	}


	if(!req.session.user || !req.session.family){
		res.json([]);
		return;
	}
	
 	models.Family
    .find({"_id": req.session.family})
    .exec(function(err, families){
		if(err) {console.log(err); res.json([]); return; }
		if(!families[0]){
			res.json([]);
			return;
		}
		//[{name: title}]
		
		var dataOut = [];
		var tasks = families[0].tasks;
		var confirmations = families[0].confirmations;
		var index;
		
		dataOut = tasks.filter( function(t){
			return confirmations.indexOf(t['_id']) > -1;
		});
		
		if(dataOut.length == 0){ //dataOut actually has nothing, then... there's nothing of use here.
				models.Family.update(
				{"_id": req.session.family},
				{$set:{"confirmations":[]}}).exec();
		}
		
		console.log("Requests being fulfilled:" + dataOut);
		
		res.json(dataOut[0]);
		return;
		/*
		var callbacksfinished = 0;

		for(index = 0; index<dataOut.length; index++){
            console.log(index);
            var email = dataOut[index].assignee;
            var i = index;

            (function (i){
                console.log(email);
                models.Person.find({"email": email}).exec(
                    function(err, people){
                        console.log(i);
                        dataOut[i]['task_description'] = tasks[i].taskText;
                        dataOut[i]['reward-point'] = tasks[i].taskReward + "pts";
                        dataOut[i].assignedTo = people[0].name;
                        callbacksfinished ++;
                        if(callbacksfinished == dataOut.length){
							//res stuff here.
							res.json(dataOut);
                            console.log(dataOut);
                        }
                    }
                );
            }(i));
        };*/
	});
}
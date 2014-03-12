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
		for(index = 0; index<confirmations.length; index++){
			var out = getObjects(tasks,"_id",confirmations[index]);
			if(out.length == 1){
				dataOut.push(out[0]);
			}else{
				models.Family.update(
				{"_id": req.session.family},
				{$pull:{"confirmations":confirmations[index]}});
			}
		}
		console.log("Requests being fulfilled:" + dataOut);
		
		res.json(dataOut);
		return;
		
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
        };
	});
}
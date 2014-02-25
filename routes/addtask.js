var models = require('../models')

exports.view = function(req, res) { 

	if(!req.cookies.user || !req.cookies.family){
		res.redirect('/login');
		return;
	}
	
	models.Family
    .find({"_id": req.cookies.family})
    .exec(afterQueryAddTask);
	function afterQueryAddTask(err, families) {
		if(err) console.log(err);
		if(!families[0]){
			res.redirect('/login');
			return;
		}
		var kids = families[0].controlees;
		var childrenOut = {"child":[]};
		var index;
		var callbacksfinished = 0;
		if(kids.length == 0){
			res.render('addtask', {
				"child": [{"name": "No Child is currently registered to your account. Register one in the Settings tab."}]
				});
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
					res.render('addtask', childrenOut);
					return;
				}
			});
		};
		//search again with the assignee email to find name
	}
	// Your code goes here
 }
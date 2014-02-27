// Get all of our friend data

var models = require('../models');

exports.view = function(req, res){
	console.log(req.cookies);	
	if(!req.cookies.user || !req.cookies.family){
		res.redirect('/login');
		return;
	}

  models.Family
    .find({"_id": req.cookies.family})
    .exec(afterQuery);

	function afterQuery(err, families) {
		if(err) console.log(err);
		if(!families[0]){
			res.redirect('/login');
			return;
		}
		var tasks = families[0].tasks;
		var index;
		var callbacksfinished = 0;
		console.log(tasks.length)
		for(index = 0; index<tasks.length; index++){
			var email = tasks[index].assignee;
			console.log(email)
			var i = index;
			
			(function (i){
				console.log(email);
				models.Person.find({"email": email}).exec(
					function(err, people){
						console.log(i);
						tasks[i]['task_description'] = tasks[i].taskText;
						tasks[i]['reward-point'] = tasks[i].taskReward + "pts";
						tasks[i].assignedTo = people[0].name;
						callbacksfinished ++;
						if(callbacksfinished == tasks.length){
							res.render('tasks', {"taskArray": tasks});
							console.log(tasks);
						}
					}
				);
			}(i));
		};
		if(tasks.length == 0){
			res.render('tasks', {"message": '<h4 style="text-align:center">No Tasks Assigned</h4>'});
		}
		//search again with the assignee email to find name
	}
};
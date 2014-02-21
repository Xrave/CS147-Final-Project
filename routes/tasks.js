// Get all of our friend data

var models = require('../models');

exports.view = function(req, res){
	console.log(req.query.user);
	if(!req.cookies.user){
		res.redirect('/login');
	}
	console.log(process.env);

  models.Family
    .find({"_id": req.cookies.family})
    .exec(afterQuery);

	function afterQuery(err, families) {
		if(err) console.log(err);
		var tasks = families[0].tasks;
		var index;
		var callbacksfinished = 0;
		for(index = 0; index<tasks.length; a++){
			var email = tasks[index].assignee;
			models.Person.find({"email": email}).exec(function(err, people){
				tasks[index]['assignedTo'] = people[0].name;
				tasks[index]['task-description'] = tasks[index].taskText;
				tasks[index]['reward-point'] = tasks[index].taskReward + "pts";
				callbacksfinished ++;
				if(callbacksfinished == tasks.length){
					res.render('tasks', {"taskArray": tasks});
				}
			});
		};
		//search again with the assignee email to find name
	}

};
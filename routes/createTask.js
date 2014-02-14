var data = require("../data.json");

exports.handle = function(req, res) { 

	var dataInput = req.body;
	
	data["taskArray"].push(dataInput);
   	res.render('tasks',data);
	// Your code goes here
 }
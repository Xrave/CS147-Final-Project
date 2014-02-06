var data = require("../data.json");

exports.addFriend = function(req, res) { 
	var name_str = req.query.name;
	var descr_str = req.query.description;
	
	
	data["friends"].push({'name':name_str, 'description':descr_str, 'imageURL':'http://lorempixel.com/400/400/people'});

   	res.render('add',data);
	// Your code goes here
 }
// JavaScript Document// Get all of our friend data
var models = require('../models');


exports.view = function(req, res){
	if(!req.session.user || !req.session.family){
		res.redirect('/login');
		return;
	}

	models.Family
    .find({"_id": req.session.family})
    .exec(rewardQuery);

	function rewardQuery(err, families) {
		if(err) console.log(err);
		console.log(families[0].rewards);
		//search again with the assignee email to find name
		res.render('rewards', {"rewards": families[0].rewards});
	}
};
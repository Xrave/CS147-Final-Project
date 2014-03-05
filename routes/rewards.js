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
        var i;
        for(i=0; i < families[0].rewards.length; i++){
            families[0].rewards[i].isParent = req.session.isParent;
        }
		//search again with the assignee email to find name
		res.render('rewards', {"rewards": families[0].rewards});
	}
};
// JavaScript Document// Get all of our friend data
exports.view = function(req, res){
	if(!req.session.user || !req.session.family){
		res.redirect('/login');
		return;
	}
	
	res.render('notifications');
};
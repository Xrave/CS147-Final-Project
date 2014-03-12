// Get all of our friend data

exports.view = function(req, res){
	if(!req.session.user || !req.session.family){
		res.redirect('/login');
		return;
	}
	if(req.session.isParent == 'true'){
		res.render('settings');
	}else{
		res.render('settings_kid');
	}
};
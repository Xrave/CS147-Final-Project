// Get all of our friend data

exports.view = function(req, res){
	if(!req.cookies.user || !req.cookies.family){
		res.redirect('/login');
	}
	res.render('settings');
};
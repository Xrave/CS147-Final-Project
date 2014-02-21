// Get all of our friend data

exports.view = function(req, res){
	if(!req.cookies.user){
		res.redirect('/login');
	}
	res.render('settings');
};
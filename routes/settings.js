// Get all of our friend data

exports.view = function(req, res){
	console.log(req.user);
	if(!req.query.user){
		res.redirect('/login');
	}
	res.render('settings');
};
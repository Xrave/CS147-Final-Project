// Get all of our friend data

exports.view = function(req, res){
	console.log(req.user);

	res.render('settings');
};
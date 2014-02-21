// Get all of our friend data
exports.view = function(req, res){
	console.log(req.query.user);
	if(!req.query.user){
		res.redirect('/login');
	}
	console.log(process.env);
	res.render('tasks');
};
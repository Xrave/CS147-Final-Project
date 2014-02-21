// Get all of our friend data
exports.view = function(req, res){
	console.log(req.user);
	if(!req.user){
		res.redirect('/login');
	}
	console.log(process.env);
	res.render('tasks');
};
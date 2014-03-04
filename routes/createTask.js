
exports.handle = function(req, res) { 
	if(!req.session.user || !req.session.family){
		res.redirect('/login');
		return;
	}
	//var dataInput = req.body;
	
   	res.render('tasks');
	// Your code goes here
 }
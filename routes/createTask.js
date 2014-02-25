
exports.handle = function(req, res) { 
	if(!req.cookies.user || !req.cookies.family){
		res.redirect('/login');
		return;
	}
	//var dataInput = req.body;
	
   	res.render('tasks');
	// Your code goes here
 }
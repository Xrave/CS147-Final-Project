// JavaScript Document
exports.view = function(req, res){
	res.render('edittask', {
		'tasks': [
		{'title': 'Clean dishes by 7',
		 'image': 'images/Placeholder_profile_red.png',
		 'comments': 'make sure to remove stains'
		}
		]
	});
};
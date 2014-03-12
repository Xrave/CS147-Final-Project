
var models = require('../models');

exports.view = function(req, res){
	if(!req.session.user || !req.session.family){
		res.redirect('/login');
		return;
	}
	/*{snapshotItems:
	[{ name: points: task completed: rewards claimed}],
	notificationItems:
	[{ taskItem:htmlstring }]
	
	such as:                    
	<span class="image">
                    <img src="http://temporarygiraffe.herokuapp.com/images/Placeholder_profile_black.png"></span>
                    <span class="description">
                        <span class="boldName">{{name}}</span> completed the task "{{title}}". <span class="pointsAdded">+{{points}}pts</span>

	or:
	<span class="image">
                    <img src="http://temporarygiraffe.herokuapp.com/images/Placeholder_profile_black.png"></span>
                    <span class="description">
                        <span class="boldName">{{name}}</span> redeemed the reward "{{title}}" for <span class="pointsAdded">{{points}}</span> pts.
	
	*/
	//globals for this generator.
	var snapshotItems = [];
	var notificationItems = [];
	var message = "";
	var notificationMessage = "";
	
	models.Family.find({'_id':req.session.family}).exec(function(e, family){
		
		var members = family[0].controlees;
		if(members.length==0){
			message = "<p>Oops, you don't have any kids! Start by making a subaccount through Settings!</p>";
		}
		
		notificationItems = family[0].notifications;
		if(notificationItems.length == 0){
			notificationMessage = "<p>You have no notifications!</p>";
		}
		
		models.Person.find({
			'email': {$in: members}
		}).exec(function(e, stuff){
			snapshotItems = stuff;
			
			res.render('notifications',
			{
				'snapshotItems':snapshotItems,
				'notificationItems':notificationItems,
				'message': message,
				'notificationMessage': notificationMessage
			});
		});
	});
};
var Mongoose = require('mongoose');
var PersonSchema = new Mongoose.Schema({
	  'email': String,
      'password': String,
      'name': String,
      'points': Number, //negative points mean you should load parent interface!
	  'numRewardsClaimed': Number,
	  'tasksCompleted': Number
});
exports.Person = Mongoose.model('Person', PersonSchema);


var FamilySchema = new Mongoose.Schema({ 
    //"_id": auto generated by mongodb.
    "controllers":[ //username array
      String
    ],
    "controlees":[ //username arraay
      String    
    ],
    "tasks":[{
      'taskID': String, //identifier of format: assigner-assignee-tasktext
      'assigner': String, //email.
      'assignee': String, //email.
	  'assigneeName': String,
      'taskText': String,
      'taskCompletion': String,  //either 'complete' or nothing.
      'taskReward': Number,
      'comments':[{
        'text': String,
        'date': Date
      }]
    }],
    "rewards":[{
      'cost': Number,
      'text': String,
    }],
    "notifications":[{
      'text': String,
      'date': Date,
    }],
	"confirmations":[
		Mongoose.Types.ObjectId
	]
  // fields are defined here
});



exports.Family = Mongoose.model('Project', FamilySchema);



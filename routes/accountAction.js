// JavaScript Document// Get all of our friend data
var mongoose = require('mongoose');
var models = require('../models')

exports.process = function(req, res){

    console.log('-------USER REQUEST-------');
    console.log(req.body);
    console.log('--------------------------');

    /*{ name: 'Xiaonan',
  email: 'xiaonan@stupid.place',
  password: 'password', points:-1 }*/

    //TODO: check if account exists already. meh.

    if(req.query.action == 'signUp'){ //SUPER INTENDENT SIGN UP.
        var userJson = req.body;
        userJson.email = userJson.email.toLowerCase();
        console.log(models.Person.find({'email':email}).limit(1).size());

        var newUser = new models.Person(userJson);
        newUser.points = -1;
        newUser.save(function(err, newUser){
            console.log(newUser + " is saved!");
            console.log("now creating family for new user");
            var json = {
                "controllers":[newUser.email],
                "controlees":[ ],
                "tasks":[],
                "rewards":[],
                "notifications":[]		};
            var newFamily = new models.Family(json);
            newFamily.save(function(err, newFamily){
                console.log(newFamily + " is saved!");
                req.session.isParent = true; //0 for parent;
                req.session.family= newFamily._id;
                req.session.user= newUser.email;
                req.session.userName = newUser.name;
                res.send(200); return;
            });
        });
    }else if(req.query.action == 'signIn'){
        var userJson = req.body;
        userJson.email = userJson.email.toLowerCase();

        models.Person
        .find(userJson)
        .exec(function(err, entry){
            if(err) console.log(err);
            if(typeof entry[0] != "undefined"){

                models.Family
                .find({$or: [{controllers:entry[0].email}, {controlees:entry[0].email}] })
                .exec(function(err, matchedFamilies){
                    if(!matchedFamilies){
                        res.send(500); //fail!
                        return;
                    }
                    console.log("\t"+entry[0].name + " Logged in!");
                    req.session.isParent = (entry[0].points < 0);
                    console.log("User is:"+req.session.isParent);
                    req.session.user = entry[0].email;
                    req.session.family= matchedFamilies[0]._id;
                    req.session.userName = entry[0].name;

                    res.send(200);
                    return;
                });
            }else{
                res.send(500); return;
            }
        });
    }else if(req.query.action == 'addNewChild'){
        var userJson = req.body;
        var email = userJson.email;
        models.Person.find({'email':email}).limit(1).exec(function(e, matched){
            if(matched.length > 0){
                res.send(500); //no good.
            }else{
                var newUser = new models.Person(userJson);
                newUser.numRewardsClaimed = 0;
                newUser.tasksCompleted = 0;
                newUser.save(function(err, newUser){
                    console.log("[ NEW CHILD ADDED ]");
                    console.log(newUser + " is saved!");
                    models.Family
                    .update({"_id":req.session.family},
                            {
                                $push: { "controlees": newUser.email }
                            })
                    .exec(function(err, useless){
                        res.send(200);
                    });
                    return;
                });
            }
            return;
        });

    }else if(req.query.action == 'addNewParent'){
        var userJson = req.body;
        var email = userJson.email;
        models.Person.find({'email':email}).limit(1).exec(function(e, matched){
            if(matched.length > 0){
                res.send(500); //no good.
            }else{
                var newUser = new models.Person(userJson);
                newUser.save(function(err, newUser){
                    console.log("[ NEW PARENT ADDED ]");
                    console.log(newUser + " is saved!");
                    models.Family
                    .update({"_id":req.session.family},
                            {
                                $push: { "controllers": newUser.email }
                            })
                    .exec(function(err, useless){
                        res.send(200);
                    });
                    return;
                });
            }
            return;
        });

    }else if(req.query.action == 'addReward'){
        var rwd = req.body;
        var familyID = req.session.family;
        /*db.bios.update(
	   { _id: 1 },
	   {
		 $push: { awards: { award: "IBM Fellow", year: 1963, by: "IBM" } }
	   }
	)*/
        models.Family
        .update({"_id":familyID},
                {$push: { "rewards" :  rwd  }
                })
        .exec(function(err, useless){
            res.send(200);
            return;
        });

    }else if(req.query.action == 'addTask'){
        var task = req.body;
        task['assigner'] = req.session.user;
        task['taskID'] = task.assigner + "-"+task.assignee+"-"+task.taskText;
        task['comments'] = [];
        models.Person.find({"email": task.assignee}).exec(
            function(err, person){
                task['assigneeName'] = person[0].name;
                models.Family
                .update({"_id":req.session.family},
                        {$push: { "tasks" :  task  }
                        })
                .exec(function(err, useless){
                    res.send(200);
                    return;
                });
            });
        return;
    }else if(req.query.action == 'logout'){
        req.session.destroy(function(){
            //delete req.session.user;
            //delete req.session.family;
        });
        res.send(200);
        return;
    }else if(req.query.action == 'editTask'){
        console.log(req.body);
        //req.body is {oldTaskID: older_id, newTaskName: newName, newAssignee: username, newPtValue: number}
        models.Family
        .update(
            {
                'tasks._id':req.body.oldTaskID
            }
            ,
            {
                $set:{
                    "tasks.$.assignee": req.body.newAssignee, 				
                    "tasks.$.taskText": req.body.newTaskName,
                    "tasks.$.assigneeName": req.body.newAssigneeName,
                    "tasks.$.taskReward":req.body.newPtValue
                }
            }
            ,
            {multi:false}
            ,
            function(err, doc){
                console.log("Actually:")
                console.log(doc); //? LOL
                res.send(200);
                return;
            });
    }else if(req.query.action == 'removeReward'){
        models.Family.update(
            {'_id':req.session.family},
            {$pull: {'rewards':{'_id': req.body.id}}},
            {multi:false},
            function(err,doc){
                console.log("removed something to do with this:"+doc);
                res.send(200);
            });
        return;
    }else if(req.query.action == 'redeemReward'){
        var rewardData = req.body;
        models.Person.find({'email':req.session.user}).exec(function(err, users){
            var user = users[0];
            if(user.points >= rewardData.cost){
                //notification:
                var notifText = '<span class="description"><span class="boldName">'+req.session.userName+'</span> redeemed the reward "'+rewardData.rewardText+'" for <span class="pointsAdded">'+rewardData.cost+'</span> pts.';
                console.log(notifText);
                models.Person.update({'email':req.session.user},{$inc: {'points':rewardData.cost*(-1), 'numRewardsClaimed':1}}).exec(function(e,d){

                    models.Family.update(
                        {'rewards._id':rewardData.id},
                        {$pull: {'rewards':{'_id':rewardData.id}}, //remove the reward and
                         $push: {'notifications':{'text':notifText}}})
                    .exec(function(e,d){
                        res.json({message:'success'});
                    });
                });
            }else{
				console.log("need more points");
                res.json({message:'Need more points to redeem!'});
            }
        });
    }else if(req.query.action == 'comment'){
        models.Family.update(
            {'tasks._id':req.body.taskID}
            ,
            {
                $push:{
                    "tasks.$.comments":{
                        text:req.body.comment,
                        $position:0
                    }
                }
            }
            ,
            {multi:false}
            ,
            function(err, doc){
                console.log(doc);
                res.send(200);
            }
        );
    }else if(req.query.action=='queueCompletedTask'){
        //1. mark the completed task as completed. & push id to completion list?
        var id = req.body.id;
        var m_id = mongoose.Types.ObjectId(id);
        console.log(m_id);
        models.Family.update(
            {'tasks._id':id},
            {$set:{ 'tasks.$.taskCompletion' : 'completed' },
             $push:{ 'confirmations': m_id}})
        .exec(
            function(err,doc){console.log(err); console.log(doc); res.send(200);});

    }else if(req.query.action == 'taskConfirm'){
        console.log("hey");
        var task = req.body.taskData;

        var notifText = '<span class="image"></span><span class="description"><span class="boldName">'+task.assigneeName+'</span> completed the task "'+task.taskText+'". <span class="pointsAdded">+'+task.taskReward+'pts</span>';

        models.Person.update(
            {'email':task.assignee},
            {$inc:{'points':task.taskReward, 'tasksCompleted':1}}).exec(
            function(err,doc){
                console.log('doc1:'+doc);

                models.Family.update(
                    {'tasks._id':task['_id']},
                    {$pull: {'tasks':{'_id':task['_id']}},
                     $push: {'notifications':{'text':notifText}}}).exec(
                    function(err2,doc2){
                        //console.log(err2);
                        console.log('doc2:'+doc2);
                        res.send(200);
                    });
            });



    }else if(req.query.action == 'taskReject'){
        models.Family.update(
            {"tasks._id": req.body.taskData['_id']},
            {
                $set:{'tasks.$.taskCompletion':''},
                $pull:{"confirmations":req.body.taskData['_id']}
            }).exec(function(e, d){res.send(200);});
    }else if(req.query.action == 'removePerson'){
        var email = req.body.email;
        var source; //place i'm pulling from
        if(req.body.isParent == 'true'){
            source = 'controllers';
            models.Family.update(
                {'_id': req.session.family},
                {$pull: {'controllers': email}}).exec();

        }else{
            source = 'controlees';
            models.Family.update(
                {'_id': req.session.family},
                {$pull: {'controlees': email}}).exec();

        }
        console.log("removing email from "+source+": "+email);

        models.Family.update(
            {'_id':req.session.family},
            {$pull:{'tasks':{'assignee':email}}}).exec();

        models.Person.remove(
            {'email': email}).exec();

        setTimeout(function(){
            res.send(200)
        },60);
    }
}
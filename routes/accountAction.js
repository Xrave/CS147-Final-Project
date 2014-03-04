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
        var newUser = new models.Person(userJson);
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
                res.cookie('family', newFamily._id);
                res.cookie('user', newUser.email);
                res.send(200); return;
            });
        });
    }else if(req.query.action == 'signIn'){
        var userJson = req.body;
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
                    res.cookie('user', entry[0].email);
                    res.cookie('family', matchedFamilies[0]._id);
                    res.send(200);
                    return;
                });
            }else{
                res.send(500); return;
            }
        });
    }else if(req.query.action == 'addNewChild'){
        var userJson = req.body;
        var newUser = new models.Person(userJson);
        newUser.save(function(err, newUser){
            console.log("[ NEW CHILD ADDED ]");
            console.log(newUser + " is saved!");
            models.Family
            .update({"_id":req.cookies.family},
                    {
                        $push: { "controlees": newUser.email }
                    })
            .exec(function(err, useless){
                res.send(200);
            });
            //res.cookie('user', newUser.email);
            return;
        });

    }else if(req.query.action == 'addNewParent'){
        var userJson = req.body;
        var newUser = new models.Person(userJson);
        newUser.save(function(err, newUser){
            console.log("[ NEW PARENT ADDED ]");
            console.log(newUser + " is saved!");
            models.Family
            .update({"_id":req.cookies.family},
                    {
                        $push: { "controllers": newUser.email }
                    })
            .exec(function(err, useless){
                res.send(200);
            });
            return;
        });

    }else if(req.query.action == 'addReward'){
        var rwd = req.body;
        var familyID = req.cookies.family;
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
        task['assigner'] = req.cookies.user;
        task['taskID'] = task.assigner + "-"+task.assignee+"-"+task.taskText;
        task['comments'] = [];
        models.Family
        .update({"_id":req.cookies.family},
                {$push: { "tasks" :  task  }
                })
        .exec(function(err, useless){
            res.send(200);
            return;
        });
    }else if(req.query.action == 'logout'){
        req.session.destroy();
        req.cookie
        return;
    }else if(req.query.action == 'editTask'){
        console.log(req.body);
        //req.body is {oldTaskID: older_id, newTaskName: newName, newAssignee: username, newPtValue: number}
        models.Family
        .update(
            {
                '_id':req.cookies.family,
                'tasks':{'._id':req.body.older_id}
            }
            ,
            {
                $set: {
                    "tasks.0.assignee": req.body.newAssignee, 				"tasks.0.taskText": req.body.newTaskName,
                    "tasks.0.taskReward":req.body.newPtValue
                }
            })
        .exec(function(err, useless){
            console.log(useless);
            res.send(200);
            return;
        });
    }else if(req.query.action == 'editRewards'){

    }
}
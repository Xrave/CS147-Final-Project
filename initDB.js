
/*
  This script will initialize a local Mongo database
  on your machine so you can do development work.

  IMPORTANT: You should make sure the

      local_database_name

  variable matches its value in app.js  Otherwise, you'll have
  initialized the wrong database.
  */

  var mongoose = require('mongoose');
  var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'choredb';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);


// Do the initialization here

// Step 1: load the JSON data

// Step 2: Remove all existing documents
models.Person
.find()
.remove()
.exec(function(err) {
  if(err) console.log(err);
  // loop over the projects, construct and save an object from each one
  // Note that we don't care what order these saves are happening in...
  var projects_json = require('./Person.json');

  var to_save_count = projects_json.length;
  for(var i=0; i<projects_json.length; i++) {
    var json = projects_json[i];
    var proj = new models.Person(json);

    proj.save(function(err, proj) {
      if(err) console.log(err);

      to_save_count--;
      console.log("persons:" +to_save_count + ' left to save');
      if(to_save_count <= 0) {

        models.Family
        .find()
        .remove()
        .exec(function(err){
          if (err) console.log(err);

          var family = require('./Family.json');

          var familycount = family.length;
          for(var i=0; i<family.length; i++) {
            var json = family[i];
            var proj = new models.Family(json);

            proj.save(function(err, proj) {
              if(err) console.log(err);

              familycount--;
              console.log("family: "+familycount + ' left to save');
              if(familycount <= 0) {
                console.log('DONE');
                  // The script won't terminate until the 
                  // connection to the database is closed
                mongoose.connection.close()

              }
            });

          }
        });
        console.log('DONE');
        // The script won't terminate until the 
        // connection to the database is closed
      }
    });
}
}); // callback to continue at

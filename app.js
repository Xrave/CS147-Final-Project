
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var mongoose = require('mongoose');
//var passport = require('passport');
//var strategy = require('./setup_auth');

var tasks = require('./routes/tasks');
var rewards = require('./routes/rewards');
var add = require('./routes/addtask');
var addreward = require('./routes/addreward');
var notif = require('./routes/notifications');
var settings = require('./routes/settings');
var accountAction = require('./routes/accountAction');
var listing = require('./routes/getPeopleLists');
// Example route
// var user = require('./routes/user');

var local_database_name = 'choredb';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

app.use(express.cookieParser());
app.use(express.session({secret: 'shhhh'}));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

//app.use(passport.initialize());
//app.use(passport.session());
  
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', tasks.view);
app.get('/alternate', tasks.viewAlt);

app.get('/addtask', add.view);
app.get('/task', tasks.renderDetails);
app.get('/addreward', addreward.view);
app.get('/login', function(req, res){
	res.render('login');
});
app.get('/rewards', rewards.view);
app.get('/notifications', notif.view);
app.get('/settings', settings.view);

app.get('/childList', listing.getChildrenList);
app.get('/parentList', listing.getParentsList);

app.post('/callback', 
		accountAction.process);


// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

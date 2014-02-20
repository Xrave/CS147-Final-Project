var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({  
    domain:       'temporarygiraffe.auth0.com',
    clientID:     'Qjs1ZHjWuSOnPaBUUteQC2skr157iTgK',
    clientSecret: 'iCUCFaKON-Mut_Cqzxo80-S5eK8OLIDaDVp-pGjrqbqkR6Ti66eoWkeQyZHieqJ3',
    callbackURL:  '/callback'
  }, function(accessToken, refreshToken, profile, done) {
    //Some tracing info
    console.log('profile is', profile);
    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user); 
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy; 
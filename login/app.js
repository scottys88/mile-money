var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , StravaStrategy = require('passport-strava-oauth2').Strategy
  , StravaApiV3 = require('strava-v3')
  , mongoose = require('mongoose')
  , promisify = require('es6-promisify')
  , mocha = require('mocha');
const Athlete = require('./models/athlete');

require('dotenv').config({ path: 'process.env' });
var STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
var STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;


//Connect to the Dabatase

    //Connect to mongoDB
  mongoose.connect('mongodb://localhost:27017/mile-money');
      mongoose.connection.once('open', function() {
          console.log('Connection has been made.');
      }).on('error', function(error) {
          console.log(`Connection error ${error}`);
  });


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Strava profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the StravaStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Strava
//   profile), and invoke a callback with a user object.
passport.use(new StravaStrategy({
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/strava/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Strava profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Strava account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
  if(req.user) {
  const athlete = new Athlete({
    id: req.user.id,
    firstName: req.user.name.givenName,
    lastName: req.user.name.familyName,
    profilePic: req.user.photos[0].value,
    commutes: [{ 
    }],
    settings: [{
      
    }]
  });

  athlete.save();
  }
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, async (req, res) => {
  const athlete = await (Athlete.findOne( {id: req.user.id }));

  StravaApiV3.athlete.listActivities({id: req.user.id},function(err,payload,limits) {
    //do something with your payload, track rate limits
    stravaActivities = payload;
    let commuteNumber = 0;
    
    
    console.log(req.user.id);
    stravaActivities.forEach(activity => {
      if(activity.commute === true) {
        commuteNumber += 1;
        athlete.commutes.push( { 
          id: activity.id,
          start_latlng: activity.start_latlng,
          end_latlng: activity.end_latlng,
          isCommute: activity.commute,
          account: "Charity",
          commuteType: "Monday Commute"
         });
         
      };

   });
    console.log(athlete.commutes);
    console.log(`The number of commutes is ${commuteNumber}`);
});
  res.render('account', { user: req.user});
});





app.get('/login', function(req, res){
  res.render('login', { user: req.user});
});

// GET /auth/strava
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Strava authentication will involve
//   redirecting the user to strava.com.  After authorization, Strava
//   will redirect the user back to this application at /auth/strava/callback
app.get('/auth/strava',
  passport.authenticate('strava', { scope: ['public'] }),
  function(req, res){
    // The request will be redirected to Strava for authentication, so this
    // function will not be called.
  });

// GET /auth/strava/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/strava/callback', 
  passport.authenticate('strava', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


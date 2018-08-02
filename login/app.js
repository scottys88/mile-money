var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , StravaStrategy = require('passport-strava-oauth2').Strategy
  , StravaApiV3 = require('strava-v3')
  , mongoose = require('mongoose')
  , promisify = require('es6-promisify')
  , mocha = require('mocha');
const Athlete = require('./models/athlete');
const Shoe = require('./models/athlete');

mongoose.Promise = global.Promise;

require('dotenv').config({ path: 'process.env' });
var STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
var STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
var DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
var PORT_NUMBER_LISTEN = process.env.PORT_NUMBER;

//Connect to the Dabatase

    //Connect to mongoDB

  mongoose.connect(DB_CONNECTION_STRING);
      mongoose.connection.once('open', function() {
          console.log(`Connection has been made. Listening on port:${PORT_NUMBER_LISTEN}`);
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
    callbackURL: `http://127.0.0.1:${PORT_NUMBER_LISTEN}/auth/strava/callback`
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


app.get('/', ensureAuthenticated, async (req, res, next) => {
  if(req.user) {
  
  const athlete = await Athlete.findOneAndUpdate({ id: req.user.id },{
    id: req.user.id,
    firstName: req.user.name.givenName,
    lastName: req.user.name.familyName,
    profilePic: req.user.photos[0].value,
    city: req.user._json.city,
    state: req.user._json.state,
    country: req.user._json.country,
    gender: req.user._json.sex,
    shoes: [],
    bikes: []
  }, { upsert: true} ).exec();


  // await athlete.save();
  next();

  }}
);


app.get('/', ensureAuthenticated, async (req, res, next) => {

const stravaShoes = req.user._json.shoes;

if(req.user) {
    const stravaShoes = req.user._json.shoes;
      stravaShoes.forEach(shoe => {
      let athlete = Athlete.update({ id: req.user.id}, 
        { $addToSet:
          { shoes: { $each: [ { 
              name: shoe.name,
              distance: shoe.distance,
              id: shoe.id
        }] } } 
      }).exec();
    }
  )
  next();
}



});



app.get('/', ensureAuthenticated, async (req, res, next) => {

    if(req.user) {
        const stravaBikes = req.user._json.bikes;
          stravaBikes.forEach(bike => {
          let athlete = Athlete.update({ id: req.user.id}, 
            { $addToSet:
              { bikes: { $each: [ { 
                  name: bike.name,
                  distance: bike.distance,
                  id: bike.id
            }] } } 
          }).exec();
        }

    )
    next();
  }

});

app.get('/', ensureAuthenticated, async (req, res) => {

  const athlete = await Athlete.findOne( { id: req.user.id } );


   res.render('index', { user: req.user, athlete });
});



app.get('/profile', ensureAuthenticated, async (req, res) => {
  StravaApiV3.athlete.get({'access_token':req.user.token},function(err,payload,limits) {
    //do something with your payload, track rate limits
  });
  StravaApiV3.athlete.listActivities({'access_token':req.user.token,
        'resource_state':3},function(err,payload,limits) {
      //do something with your payload, track rate limits
      stravaActivities = payload;

    stravaActivities.forEach(activity => {
      if(activity.commute === true) {
      let athlete = Athlete.update( {id: req.user.id },
      { $addToSet: 
        { commutes: { $each: [ {
            commuteId: activity.id,
            start_latlng: activity.start_latlng,
            end_latlng: activity.end_latlng,
            isCommute: activity.commute, 
            commuteType: activity.type,
            commuteName: activity.name,
            commuteDate: activity.start_date,
            startDateLocal: activity.start_date_local,
            distance: activity.distance,
            movingTime: activity.moving_time,
            elapsedTime: activity.elapsed_time
      }] } } 
      }).exec(); 
    }
  });
});
  res.render('profile', { user: req.user});
});


app.get('/login', function(req, res){
  res.render('login', { user: req.user});
});

app.get('/commute-costs', function(req, res){
  res.render('commutes', { user: req.user});
});

app.post('/commute-costs', async (req, res) => {
  const newCommuteCosts = await Athlete.findOneAndUpdate({
    id: req.user.id
  }, 
  {
    $push: {
      commuteCosts: {
        userCommute: req.body.userCommute,
        fuel: req.body.fuel,
        bus: req.body.bus,
        parking: req.body.parking,
        timeHours: req.body.timeHours,
        timeMinutes: req.body.timeMinutes,
        train: req.body.train,
        totalCost: req.body.totalCost
      }
    }

  }).exec();
  res.render('commutes', { user: req.user});
});


app.get('/wishlist', ensureAuthenticated, function(req, res, next){
  res.render('wishlist', { user: req.user});
});

app.post('/wishlist', async (req, res) => {
  const newWishList = await Athlete.findOneAndUpdate({
    id: req.user.id
  }, 
  {
    $push: {
      wishList: {
        itemName: req.body.itemName,
        itemCost: req.body.itemCost,
        itemURL: req.body.itemURL,
        tags: req.body.tags
      }
    }

  }).exec();
  res.render('wishlist', { user: req.user});
});


app.get('/wishlist/:id', ensureAuthenticated, async (req, res) => {
  const athlete = await Athlete.find({ 'wishList._id': req.params.id  }, { 'wishList.$': 1 });
  const wishListItem = athlete[0].wishList[0];
  console.log(wishListItem);
  res.render('wishlistEdit', { user: req.user, wishListItem });
});


app.post('/wishlist/:id', ensureAuthenticated, async (req, res) => {
  console.log(req.params);

  const wishList = await Athlete.update({ 'wishList._id': req.params.id},
    {
      $set: {
        "wishList.$.itemName": req.body.itemName,
        "wishList.$.itemCost": req.body.itemCost,
        "wishList.$.itemURL": req.body.itemURL,
      }
    });
  console.log(wishList);

  res.redirect('/');
});

app.get('/wishlist/delete/:id', ensureAuthenticated, async (req, res) => {
  console.log(req.params);
  console.log(req.body);

  const deletedItem = await Athlete.update({ 'wishList._id': req.params.id},
    {
      $pull: {
        wishList: {
          _id: req.params.id
        } 
      }
    });

  res.redirect('/');
});


app.get('/accounts', ensureAuthenticated, function(req, res, next){
  res.render('accounts', { user: req.user});
});

app.post('/accounts', async (req, res) => {
  const newAccount = await Athlete.findOneAndUpdate({
    id: req.user.id
  }, 
  {
    $push: {
      accounts: {
        accountName: req.body.accountName,
        accountNotes: req.body.accountNotes
      }
    }

  }).exec();
  res.render('accounts', { user: req.user});
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

app.listen(process.env.PORT_NUMBER);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


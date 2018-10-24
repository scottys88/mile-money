var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , StravaStrategy = require('passport-strava-oauth2').Strategy
  , StravaApiV3 = require('strava-v3')
  , mongoose = require('mongoose')
  , promisify = require('es6-promisify')
  , path = require('path')
  , ejs = require('ejs')
  , schedule = require('node-schedule')
  , mocha = require('mocha');
const Athlete = require('./models/athlete');
const Shoe = require('./models/athlete');
const mail = require('./mail');






// var defaultClient = StravaApiV3.ApiClient.instance;

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
  
  app.use(express.cookieParser('secretString'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session({cookie: { maxAge: 60000 }}));
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname + '/src')));
});

//Finds and updates an athlete if one is not found in the db
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
    email: req.user._json.email,
    shoes: [],
    bikes: [],
    $setOnInsert: {
      commuteCosts: [{ 
        userCommute: "Main commute cost",
        totalCost: 0
    }],
      "settings.autoUpdateCommutes": false,
      "settings.emailMarketing": false,
      "settings.emailNotifications": false
    }
  }, { upsert: true} ).exec();
  // await athlete.save();
  next();

  }}
);

//Adds new shoes to the athlete. If shoe already exists then updates it
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


//Adds new bikes ot the db if bike already exists then updates it
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


//This middleware will collect the strava athletes activities
app.get('/', ensureAuthenticated, async (req, res, next) => {
    StravaApiV3.athlete.get({'access_token':req.user.token},function(err,payload,limits) {
      //do something with your payload, track rate limits
    });

    StravaApiV3.athlete.listActivities({'access_token':req.user.token,
          'resource_state':3},function(err,payload,limits) {
        //do something with your payload, track rate limits
        stravaActivities = payload;

      stravaActivities.forEach(activity => {
        if(activity.commute === true) {
          let athlete = Athlete.update( {id: req.user.id, 'commutes.commuteId': { $ne: activity.id} },
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


  next();

});

//This middleware will do something, I think it is about aggregating number of commutes for an account...
app.get('/', ensureAuthenticated, async (req, res, next) => {

  let athlete = await Athlete.aggregate([ { $match: { id: req.user.id } }, 
    {
     $unwind: "$commutes" },
     { $project: { commuteId: "$commutes.commuteId" }},
     { $group: {
        _id: { commuteId: "$commuteId" },
        dups: { $addToSet: "$commuteId" },
        count: { $sum: 1 }
        }
      },
     {
      $match:
        {
          count: {"$gt": 1}
        }
      
    }
     
    ]);

    let duplicates = athlete.map(x => x.dups[0]);
    console.log(duplicates);

    const deletedItem = await Athlete.updateOne({ 'commutes.commuteId': duplicates[0]},
    {
      $pull: {
        commutes: {
          commuteId: duplicates[0]
        } 
      }
    });



  next();

});


app.get('/', ensureAuthenticated, async (req, res) => {

  const athlete = await Athlete.findOne( { id: req.user.id } );

  const athleteCommutes = athlete.commutes;
  const commuteCosts = athlete.commuteCosts;
  const athleteWishListItems = athlete.wishList;
  // const athleteAccounts = athlete.accounts[0];
  let totalRedeemed = 0;
  let mileMoneyBalance = 0;

  var array = [];
  

  athleteCommutes.forEach(commute => {
    commuteCosts.forEach(cost => {
      if(commute.commuteCosts == cost.userCommute){
      mileMoneyBalance += cost.totalCost;
      console.log(cost.totalCost);
      console.log(mileMoneyBalance);
      }
    });
  });

  athleteCommutes.sort(function compare(a, b) {
    var dateA = new Date(a.commuteDate);
    var dateB = new Date(b.commuteDate);
    return dateB - dateA;
  });

  athleteWishListItems.forEach(item => {
    if(item.redeemed === true) {
      console.log(item.itemCost);
      totalRedeemed += item.itemCost;
    };
  })
  console.log(mileMoneyBalance);
  console.log(req.user.token);
  console.log(`Total value redeemed is ${totalRedeemed}`);
   res.render('index', { messages: req.flash('info'), user: req.user, athlete, totalRedeemed, athleteCommutes, mileMoneyBalance });
});

//scheduled task to run only Friday at 3:30PM
var j = schedule.scheduleJob({hour: 21, minute: 33, dayOfWeek: 2}, async function(){
  const athletes = await Athlete.find({'settings.emailNotifications': true});
  
  athletes.forEach(athlete => {
    const athleteWishListItems = athlete.wishList;
    const athleteCommutes = athlete.commutes;
    const commuteCosts = athlete.commuteCosts;
    let mileMoneyBalance = 0;
    let totalSaved = 0;
    let totalRedeemed = 0;
    athleteWishListItems.forEach(item => {
      if(item.redeemed === true) {
        console.log(item.itemCost);
        totalRedeemed += item.itemCost;
      };
    })
    athleteCommutes.forEach(commute => {
      commuteCosts.forEach(cost => {
        if(commute.commuteCosts == cost.userCommute){
          totalSaved += cost.totalCost;
          }
      });
    });
    mileMoneyBalance = totalSaved - totalRedeemed;


    mail.send({
 
      from: 'Mile Money <noreply@milemoney.io>',
      to: athlete.email,
      subject: "You've almost reached a Mile Money goal!",
      html: `<p>Your Mile Money Balance is currently: <strong> $${mileMoneyBalance}</strong>.<p>
             <p>You're lifetime Mile Money earnt is: $${totalSaved}. You have redeemed $${totalRedeemed} Mile Money.</p>`

  });
  
  })

});


//test route for the mail transport
app.get('/notification', async(req, res) => { 
  mail.send({
 
      from: 'Mile Money <noreply@milemoney.io>',
      to: 'someguy@example.com',
      subject: "You've almost reached a Mile Money goal!",
      html: '<p>Test email works yahoo!</p>'
  });
  res.status(200).send({'notification' : 'notification page'});
})

app.get('/about', async (req, res) => {

  res.render('about', {user: req.user});
});

app.get('/privacy', async (req, res) => {

  res.render('privacy', {user: req.user});
});


//This route is used for deleting a users profile on the profile page
app.post('/profile', ensureAuthenticated, async (req, res) => {
  await Athlete.deleteOne({ id: req.user.id });
  req.logout();
  res.redirect('/');
});


//Used for  displaying the profile page
app.get('/profile', ensureAuthenticated, async (req, res) => {
  let athlete = await Athlete.findOne({'id': req.user.id});
  const commuteCosts = athlete.commuteCosts;
  const athleteCommutes = athlete.commutes;
  const athleteWishListItems = athlete.wishList;
  // const athleteAccounts = athlete.accounts[0];
  let totalRedeemed = 0;
  let mileMoneyBalance = 0;


athleteCommutes.forEach(commute => {
  commuteCosts.forEach(cost => {
    if(commute.commuteCosts == cost.userCommute){
    mileMoneyBalance += cost.totalCost;
    console.log(cost.totalCost);
    console.log(mileMoneyBalance);
    }
  });
});

athleteCommutes.sort(function compare(a, b) {
  var dateA = new Date(a.commuteDate);
  var dateB = new Date(b.commuteDate);
  return dateB - dateA;
});

athleteWishListItems.forEach(item => {
  if(item.redeemed === true) {
    console.log(item.itemCost);
    totalRedeemed += item.itemCost;
  };
})
res.render('profile', {user: req.user, athlete, mileMoneyBalance, totalRedeemed});
});

//This route acts as the get request for the webooks. It will return the important hub.challenge code back to validate subscription
app.get('/webhooks', (req, res) => {
  let referrerURL =  req.originalUrl;
  console.log(referrerURL);
  let queryParams = referrerURL.split('&');
  
  let hubChallenge = queryParams[0].split('?');
  let hub = hubChallenge[1].split('=');
  hub = hub[1];

  let finalResponse = {
    "hub.challenge" : hub
  }
  finalResponse = JSON.stringify(finalResponse);

  console.log(typeof(finalResponse));
  
  console.log(finalResponse);
    app.get('https://api.strava.com/api/v3/push_subscriptions?client_id=22264&client_secret=f31774d980e2f6e97403b8fd404deecff420201a&callback_url=http://918d6c5b.ngrok.io&verify_token=STRAVA', (req, res) => {
      res.send(finalResponse);
    })
  res.status(200).send({"hub.challenge": hub});
});

app.post('/webhooks', (req, res, next) => {
  console.log(req.body);
  if(req.body.aspect_type === "create"){
    let athleteID = req.body.owner_id;
    Athlete.findOne({'id': athleteID}).then(function(athlete){
      
    })
  }
  next();
});

//save new activity if commute from webhooks
app.post('/webhooks', async (req, res, next) => {

  StravaApiV3.activities.get({
    'access_token':process.env.STRAVA_ACCESS_TOKEN, 
    //req.body here is the object returned from the webhooks it is used to query the database
    id: req.body.object_id}, function(err, payload, limits){
      //payload here is the actual activity id
      activity = payload;

      if (req.body.aspect_type === 'create') {
        if(activity.commute === true) {
          let athlete = Athlete.update( {id: req.body.owner_id, 'commutes.commuteId': { $ne: activity.id} },
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
          },{upsert: true}).exec(); 
          console.log('actvity saved');
          
          Athlete.findOne( {id: req.body.owner_id }, function(err, cost){
            console.log(cost);
          if(cost.settings.autoUpdateCommutes == true){

          let userCommuteCosts = cost.commuteCosts;
          let totalCost = 0;
            userCommuteCosts.forEach(item => {
              if(item.userCommute === "Main commute cost"){
                totalCost = item.totalCost;
                return totalCost;
              }
            })

              StravaApiV3.activities.update({access_token: process.env.STRAVA_ACCESS_TOKEN, id: req.body.object_id, name: `#MileMoney.io $${totalCost} saved with this commute`},function(err,payload,limits){
              if(!err) {
              }
              else {
                console.log(err);
              }
            })
          
          } else {
            console.log('Athlete auto update settings are off');
          }});
          

        };
      } else {
        next();
      };
    });
});

//delete commute from database triggered from webhooks
app.post('/webhooks', async (req, res, next) => {
     
     if (req.body.aspect_type === 'delete') {

      let athlete = await Athlete.update( { 'commutes.commuteId': req.body.object_id}, 
      {
        $pull: {
          commutes: {
            commuteId: req.body.object_id
          } 
        }
      });
      console.log('activity deleted');
      res.status(200).send();
    } else {
      next();
    }
  });

//update commute from database triggered from webhooks
app.post('/webhooks', async (req, res, next) => {
     
  if (req.body.aspect_type === 'update') {

   StravaApiV3.activities.get({
    'access_token':process.env.STRAVA_ACCESS_TOKEN, 
    //req.body here is the object returned from the webhooks 
    id: req.body.object_id}, function(err, payload, limits){
      //payload here is the actual activity id
      var activity = payload;

    })};

        if(activity.commute === true) {
          let athlete = await Athlete.update( {'commutes.commuteId': activity.id },
          { 
            $set: {
                'commutes.$.commuteName': activity.name
          } 
        })
        console.log('actvity updated');
        res.status(200).send();
      } else {
        next();
}});


//delete commute from database triggered from webhooks only if updated activity is NOT A COMMUTE
app.post('/webhooks', async (req, res, next) => {
  StravaApiV3.activities.get({
    'access_token':process.env.STRAVA_ACCESS_TOKEN, 
    //req.body here is the object returned from the webhooks 
    id: req.body.object_id}, function(err, payload, limits){
      //payload here is the actual activity id
      var activity = payload;

    });
     
  if (req.body.aspect_type === 'update' && activity.commute === false) {
    console.log(req.body.object_id + ' delete');
   let athlete = await Athlete.update( { 'commutes.commuteId': req.body.object_id}, 
   {
     $pull: {
       commutes: {
         commuteId: req.body.object_id
       } 
     }
   });
   console.log('activity deleted because no longer a commute');
   res.status(200).send();
 } else {
    console.log('could not update!');
 }
});
 
app.get('/notifications', ensureAuthenticated, async function(req, res, next){
    let athlete = await Athlete.findOne({'id': req.user.id});
    const commuteCosts = athlete.commuteCosts;
    const athleteCommutes = athlete.commutes;
    const athleteWishListItems = athlete.wishList;
    // const athleteAccounts = athlete.accounts[0];
    let totalRedeemed = 0;
    let mileMoneyBalance = 0;


  athleteCommutes.forEach(commute => {
    commuteCosts.forEach(cost => {
      if(commute.commuteCosts == cost.userCommute){
      mileMoneyBalance += cost.totalCost;
      console.log(cost.totalCost);
      console.log(mileMoneyBalance);
      }
    });
  });

  athleteCommutes.sort(function compare(a, b) {
    var dateA = new Date(a.commuteDate);
    var dateB = new Date(b.commuteDate);
    return dateB - dateA;
  });

  athleteWishListItems.forEach(item => {
    if(item.redeemed === true) {
      console.log(item.itemCost);
      totalRedeemed += item.itemCost;
    };
  })
  res.render('notifications', {user: req.user, athlete, mileMoneyBalance, totalRedeemed});
});


//Posts the notification preferences to the database. Converts the Material Design switch 'on' resonse to boolean before saving  
app.post('/notifications', ensureAuthenticated, async function(req, res, next){
 
   //Convert the 'on' response from Google into true/false
   if(req.body.emailNotifications === 'on'){
    req.body.emailNotifications = true;
   }
   if(req.body.emailNotifications === undefined){
    req.body.emailNotifications = false;
   }
   if(req.body.autoUpdateCommutes === 'on'){
    req.body.autoUpdateCommutes = true;
   }
   if(req.body.autoUpdateCommutes === undefined){
    req.body.autoUpdateCommutes = false;
   }
   if(req.body.emailMarketing === 'on'){
    req.body.emailMarketing = true;
   }
   if(req.body.emailMarketing === undefined){
    req.body.emailMarketing = false;
   }

    Athlete.updateOne({ "id": req.user.id },
                              { $set: {
                                  "settings.emailNotifications": req.body.emailNotifications,
                                  "settings.autoUpdateCommutes": req.body.autoUpdateCommutes,
                                  "settings.emailMarketing": req.body.emailMarketing,
                              }}).exec();
    req.flash('info', 'Your notification preferences have been updated.')
res.redirect('/');
});





app.get('/login', function(req, res, next){
  
  res.render('login', {user: req.user});
});





app.get('/commute-costs', ensureAuthenticated, async (req, res) => {
  let athlete = await Athlete.findOne( {id: req.user.id});
  const commuteCosts = athlete.commuteCosts;
    const athleteCommutes = athlete.commutes;
    const athleteWishListItems = athlete.wishList;
    // const athleteAccounts = athlete.accounts[0];
    let totalRedeemed = 0;
    let mileMoneyBalance = 0;
  

  athleteCommutes.forEach(commute => {
    commuteCosts.forEach(cost => {
      if(commute.commuteCosts == cost.userCommute){
      mileMoneyBalance += cost.totalCost;
      console.log(cost.totalCost);
      console.log(mileMoneyBalance);
      }
    });
  });

  athleteCommutes.sort(function compare(a, b) {
    var dateA = new Date(a.commuteDate);
    var dateB = new Date(b.commuteDate);
    return dateB - dateA;
  });

  athleteWishListItems.forEach(item => {
    if(item.redeemed === true) {
      console.log(item.itemCost);
      totalRedeemed += item.itemCost;
    };
  })
  
  res.render('commuteCostNew', { user: req.user, athlete, totalRedeemed, mileMoneyBalance});
});

app.get('/commute-costs-delete', ensureAuthenticated, async (req, res) => {

  const deletedItem = await Athlete.update({ 'commuteCosts._id': req.query.id},
  {
    $pull: {
      commuteCosts: {
        _id: req.query.id
      } 
    }
  });
  req.flash('info', 'Commute cost deleted.');
  res.redirect('/');
});

app.post('/commute-costs', ensureAuthenticated, async (req, res) => {
  console.log(req.body);
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
        other: req.body.other,
        totalCost: req.body.totalCost
      }
    }

  }).exec();
  req.flash('info', 'New commute cost created.')
  res.redirect('/');
});

app.get('/commute-edit', ensureAuthenticated, async (req, res) => {
  console.log(req.query.id);
  const activity = await Athlete.find({ 'commutes.commuteId': req.query.id  }, { 'commutes.$': 1 });
  const person = await Athlete.findOne({ 'id': req.user.id  });
  console.log(person.commuteCosts[0]);
  const commute = activity[0].commutes[0];

  let athlete = await Athlete.findOne( {id: req.user.id});
  const commuteCosts = athlete.commuteCosts;
    const athleteCommutes = athlete.commutes;
    const athleteWishListItems = athlete.wishList;
    // const athleteAccounts = athlete.accounts[0];
    let totalRedeemed = 0;
    let mileMoneyBalance = 0;
  

  athleteCommutes.forEach(commute => {
    commuteCosts.forEach(cost => {
      if(commute.commuteCosts == cost.userCommute){
      mileMoneyBalance += cost.totalCost;
      console.log(cost.totalCost);
      console.log(mileMoneyBalance);
      }
    });
  });

  athleteCommutes.sort(function compare(a, b) {
    var dateA = new Date(a.commuteDate);
    var dateB = new Date(b.commuteDate);
    return dateB - dateA;
  });

  athleteWishListItems.forEach(item => {
    if(item.redeemed === true) {
      console.log(item.itemCost);
      totalRedeemed += item.itemCost;
    };
  })
  
  


  res.render('commuteEdit', { user: req.user, commute, person, athlete, totalRedeemed, mileMoneyBalance });
});

app.post('/commute-edit', ensureAuthenticated, async (req, res) => {
  console.log(req.body.commuteCosts);

  const commute = await Athlete.update({ 'commutes.commuteId': req.query.id},
    {
      $set: {
        "commutes.$.commuteCosts": req.body.commuteCosts
      }
    });


  req.flash('info', 'Your commute has been updated');
  res.redirect('/');
});


app.get('/commute-costs-edit', ensureAuthenticated, async (req, res) => {
  const cost = await Athlete.find({ 'commuteCosts._id': req.query.id  }, { 'commuteCosts.$': 1 });
  const commuteCostEdit = cost[0].commuteCosts[0];
  
  let athlete = await Athlete.findOne( {id: req.user.id});
  const commuteCosts = athlete.commuteCosts;
    const athleteCommutes = athlete.commutes;
    const athleteWishListItems = athlete.wishList;
    // const athleteAccounts = athlete.accounts[0];
    let totalRedeemed = 0;
    let mileMoneyBalance = 0;
  

  athleteCommutes.forEach(commute => {
    commuteCosts.forEach(cost => {
      if(commute.commuteCosts == cost.userCommute){
      mileMoneyBalance += cost.totalCost;
      console.log(cost.totalCost);
      console.log(mileMoneyBalance);
      }
    });
  });

  athleteCommutes.sort(function compare(a, b) {
    var dateA = new Date(a.commuteDate);
    var dateB = new Date(b.commuteDate);
    return dateB - dateA;
  });

  athleteWishListItems.forEach(item => {
    if(item.redeemed === true) {
      console.log(item.itemCost);
      totalRedeemed += item.itemCost;
    };
  })
  


  res.render('commuteCostEdit', { user: req.user, commuteCostEdit, athlete, totalRedeemed, mileMoneyBalance });
});

app.post('/commute-costs/edit/:id', ensureAuthenticated, async (req, res) => {
  console.log(req.params);

  const commuteCost = await Athlete.update({ 'commuteCosts._id': req.params.id},
    {
      $set: {
        "commuteCosts.$.userCommute": req.body.userCommute,
        "commuteCosts.$.fuel": req.body.fuel,
        "commuteCosts.$.bus": req.body.bus,
        "commuteCosts.$.parking": req.body.parking,
        "commuteCosts.$.train": req.body.train,
        "commuteCosts.$.other": req.body.other,
        "commuteCosts.$.totalCost": req.body.totalCost
      }
    });
    console.log(commuteCost);
    req.flash('info', 'Commute cost updated.');
  res.redirect('/');
});


app.get('/wishlist', ensureAuthenticated, async(req, res, next) => {
  let athlete = await Athlete.findOne( {id: req.user.id});
  const commuteCosts = athlete.commuteCosts;
    const athleteCommutes = athlete.commutes;
    const athleteWishListItems = athlete.wishList;
    // const athleteAccounts = athlete.accounts[0];
    let totalRedeemed = 0;
    let mileMoneyBalance = 0;
  

  athleteCommutes.forEach(commute => {
    commuteCosts.forEach(cost => {
      if(commute.commuteCosts == cost.userCommute){
      mileMoneyBalance += cost.totalCost;
      console.log(cost.totalCost);
      console.log(mileMoneyBalance);
      }
    });
  });

  athleteCommutes.sort(function compare(a, b) {
    var dateA = new Date(a.commuteDate);
    var dateB = new Date(b.commuteDate);
    return dateB - dateA;
  });

  athleteWishListItems.forEach(item => {
    if(item.redeemed === true) {
      console.log(item.itemCost);
      totalRedeemed += item.itemCost;
    };
  })
  res.render('wishlist', { user: req.user, athlete, mileMoneyBalance, totalRedeemed});
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
        tags: req.body.tags,
        redeemed: false
      }
    }

  }).exec();
  req.flash('info', 'Wishlist item created');
  res.redirect('/');
});

app.put('/commute-update', async(req, res) => {
  StravaApiV3.activities.update({access_token: process.env.STRAVA_ACCESS_TOKEN, id: 1877156498, name: '#MileMoney Commute'},function(err,payload,limits){
    if(!err) {
      console.log(payload)
    }
    else {
      console.log(err);
    }
  })


})

app.get('/wishlist-edit', ensureAuthenticated, async (req, res) => {
  console.log(req.body);
  const item = await Athlete.find({ 'wishList._id': req.query.id  }, { 'wishList.$': 1 });
  const wishListItem = item[0].wishList[0];
  console.log(wishListItem);
  let athlete = await Athlete.findOne( {id: req.user.id});
  const commuteCosts = athlete.commuteCosts;
    const athleteCommutes = athlete.commutes;
    const athleteWishListItems = athlete.wishList;
    // const athleteAccounts = athlete.accounts[0];
    let totalRedeemed = 0;
    let mileMoneyBalance = 0;
  

  athleteCommutes.forEach(commute => {
    commuteCosts.forEach(cost => {
      if(commute.commuteCosts == cost.userCommute){
      mileMoneyBalance += cost.totalCost;
      console.log(cost.totalCost);
      console.log(mileMoneyBalance);
      }
    });
  });

  athleteCommutes.sort(function compare(a, b) {
    var dateA = new Date(a.commuteDate);
    var dateB = new Date(b.commuteDate);
    return dateB - dateA;
  });

  athleteWishListItems.forEach(item => {
    if(item.redeemed === true) {
      console.log(item.itemCost);
      totalRedeemed += item.itemCost;
    };
  })
  res.render('wishlistEdit', { user: req.user, wishListItem, athlete, totalRedeemed, mileMoneyBalance });
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
  req.flash('info', 'Wishlist item updated.');
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
    req.flash('info', 'Wishlist item deleted.');
  res.redirect('/');
});

app.get('/wishlist/redeem/:id', ensureAuthenticated, async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  

  const redeemedItem = await Athlete.updateOne({ 'wishList._id': req.params.id},
    { 
      $currentDate: { "wishList.$.updatedAt": { $type: "date" } },
      
      $set: {
        "wishList.$.redeemed": true,
      },
      
    }
     
    );
    req.flash('info', 'Wishlist item redeemed! Great work!');
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
        accountNotes: req.body.accountNotes,
        accountBalance: 0
      }
    }

  }).exec();
  res.render('accounts', { user: req.user});
});

app.get('/token-verification', async (req, res) => {
  res.status(200).send({'working fine': 'working fine'});
});


var request = require("request");

var options = { method: 'POST',
  url: 'https://api.strava.com/api/v3/push_subscriptions',
  qs: 
   { client_id: '22264',
     client_secret: 'f31774d980e2f6e97403b8fd404deecff420201a',
     callback_url: 'http://918d6c5b.ngrok.io/webhooks',
     verify_token: 'STRAVA' },
  headers: 
   { 'Postman-Token': '816d7fdf-57f4-4ffa-885f-61fedfe989b7',
     'Cache-Control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { client_id: '22264',
     client_secret: 'f31774d980e2f6e97403b8fd404deecff420201a',
     callback_url: 'http://918d6c5b.ngrok.io/webhooks',
     verify_token: 'STRAVA' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});



// GET /auth/strava
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Strava authentication will involve
//   redirecting the user to strava.com.  After authorization, Strava
//   will redirect the user back to this application at /auth/strava/callback
app.get('/auth/strava',
  passport.authenticate('strava', { scope: ['write'] }),
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

app.listen(process.env.PORT_NUMBER || 3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


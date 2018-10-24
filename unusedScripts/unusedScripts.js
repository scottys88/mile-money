//The below is used to push in the activity/ commutes for users. Was not used in the end.
app.get('/account', ensureAuthenticated, async (req, res) => {
  let athlete = await (Athlete.findOne( {id: req.user.id }));
  console.log(athlete);
  StravaApiV3.athlete.get({'access_token':req.user.token},function(err,payload,limits) {
    //do something with your payload, track rate limits
    
  });
  StravaApiV3.athlete.listActivities({'access_token':req.user.token,
      'resource_state':3},function(err,payload,limits) {
    //do something with your payload, track rate limits
    stravaActivities = payload;
    let commuteNumber = 0;

    stravaActivities.forEach(activity => {
      if(activity.commute === true) {
        commuteNumber += 1;
        athlete.commutes.push( { 
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
         });
         
      };
      
   });
   athlete.save();
    
    console.log(`The number of commutes is ${commuteNumber}`);
});
  res.render('account', { user: req.user});
});

//The below was used in attempt to add new users and avoid dups. Updated with fineoneandupdate
app.get('/', ensureAuthenticated, async (req, res, next) => {
  existingUser = await Athlete.findOne({id: req.user.id});
  if(existingUser) {
    existingUser = await Athlete.findOneAndUpdate({ id: req.user.id }, {
      id: req.user.id,
      firstName: req.user.name.givenName,
      lastName: req.user.name.familyName,
      profilePic: req.user.photos[0].value,
      city: req.user._json.city,
      state: req.user._json.state,
      country: req.user._json.country,
      gender: req.user._json.sex
  },{upsert: true}).exec();
    console.log('existing user');
    res.render('index', { user: req.user });
    next();
  }
  else {
    next();
  }
});

app.get('/', ensureAuthenticated, async (req, res, next) => { 
  Athlete.findOne({id: req.user.id}, {}, function (err, athlete) {
    if (err) {
      console.log('Error');
    }
    else {
      req.user._json.shoes.forEach(shoe => {
        athlete.shoes.push({
          name: shoe.name,
          distance: shoe.distance
        });
      });
  };
  res.render('index', { user: req.user });
  });
});


//Previously used script for adding new shoes to an account

// app.get('/', ensureAuthenticated, async (req, res, next) => {
// if(req.user) {
//       athlete = await Athlete.findOne({ id: req.user.id});
//       req.user._json.shoes.forEach(shoe => {
//         athlete.shoes.push({
//           name: shoe.name,
//           distance: shoe.distance,
//           id: shoe.id
//         });
//       });
//     };
//     athlete.save();
//     next();
//    res.render('index', { user: req.user });
// });



athleteWishListItems.forEach(item => {
  if(item.redeemed === true) {
    console.log(item.itemCost);
    totalRedeemed += item.itemCost;
    console.log(totalRedeemed);
  };
})

athleteCommutes.forEach(commute => {
  commuteCosts.forEach(cost => {
    if(commute.commuteCosts == cost.userCommute) {
      console.log(`Match: ${cost.totalCost}`);
      athleteAccounts.forEach(account => {
        if(commute.account == account.accountName) {
          let accountTotal = account.accountBalance;
          console.log(accountTotal);
          
          accountTotal += cost.totalCost;
          console.log(`Matched to the account ${account.accountName}`);
          console.log(`total account balance ${accountTotal}`);
        }
      })
      console.log(`Add to the account: `)
    }
    else {
      console.log("no matches")
    }
  });
});




console.log(`Total value redeemed is ${totalRedeemed}`);

console.log(athleteWishListItems);



////////Very important strava webhooks callback!!

app.get('/login', function(req, res, next){
  
  let referrerURL = req.headers.referer;
  let queryParams = referrerURL.split('&');
  
  let hubChallenge = queryParams[0].split('?');
  let hub = hubChallenge[1].split('=');
  hub = hub[1];

  let finalResponse = {
    "hub.challenge" : hub
  }
  finalResponse = JSON.stringify(finalResponse);

  console.log(typeof(finalResponse));
  if(finalResponse) {
  console.log(finalResponse);
    app.get('https://api.strava.com/api/v3/push_subscriptions?client_id=22264&client_secret=f31774d980e2f6e97403b8fd404deecff420201a&callback_url=http://5b4f0342.ngrok.io&verify_token=STRAVA', (req, res) => {
      res.send(finalResponse);
    })
  }
  console.log(hub);
  res.status(200).send({finalResponse, "hub.challenge": hub, user: req.user });
});

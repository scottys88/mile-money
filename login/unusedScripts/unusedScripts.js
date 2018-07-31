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
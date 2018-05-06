exports.homePage = (req, res) => {
  // let stravaData = strava.athlete.get(function(err, response) {
  // 	return response;
  	res.render('index', { title: 'Hey' });
  };

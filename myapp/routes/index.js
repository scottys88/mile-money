var express = require('express');
var router = express.Router();
const strava = require('strava')({
        client_id: "22264",	
        client_secret: "f31774d980e2f6e97403b8fd404deecff420201a",
        redirect_uri: "http://localhost:3000/mile-money/",
        access_token: "a481290c9c01de67dbef70f0fb0b1207591c75cb"
}); 

strava.athlete.get(function(err, res) {
        console.log(res);
});				
 		   					   
							   	

/* GET home page. */
router.get('/', function(req, res, next) {
  let stravaData = strava.athlete.get(function(err, response) {
  	return response;
  });
  res.render('index', { title: response });
});

module.exports = router;


/* GET home page. */
router.get('/', function(req, res, next) {
  

	strava.athlete.get(function(err, response) {
        console.log(response);
    });
  	res.send(response);
});

module.exports = router;

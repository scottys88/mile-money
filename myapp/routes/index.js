var express = require('express');
var router = express.Router();
const dataController = require('../controllers/dataController');
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
router.get('/', dataController.homePage);

module.exports = router;


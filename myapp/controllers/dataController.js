const mongoose = require('mongoose');
const wishlistItem = mongoose.model('wishlistItem');
const strava = require('strava')({
        client_id: "22264",	
        client_secret: "f31774d980e2f6e97403b8fd404deecff420201a",
        redirect_uri: "http://localhost:3000/mile-money/",
        access_token: "a481290c9c01de67dbef70f0fb0b1207591c75cb"
}); 


exports.homePage = (req, res) => {
  // let stravaData = strava.athlete.get(function(err, response) {
  // 	return response;
  	res.render('index', { title: 'Shit some silly stuff' });
  };

exports.addItem = (req, res) => {
  res.render('addItem', {title: 'Add an Item'});
};

exports.saveItem = async (req, res) => {
  const item = new wishlistItem(req.body);
  await item.save();
  res.redirect('/');
};

exports.scottStrava = (req, res) => {
  let stravaData = strava.athlete.get(function(err, stravaData) {
  	res.render('index', { stravaData: stravaData });
  })};

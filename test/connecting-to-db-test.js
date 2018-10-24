const mongoose = require('mongoose');
require('dotenv').config({ path: 'process.env' });
var DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

//Connect to mongoDB
before(function(done){
  mongoose.connect(DB_CONNECTION_STRING);
      mongoose.connection.once('open', function() {
          console.log(`Connection has been made.`);
          done();
      }).on('error', function(error) {
          console.log(`Connection error ${error}`);
  });
});

// Drop the characters collection before each test
beforeEach(function(done){
    //drop the collection
    mongoose.connection.collections.athletes.drop(() => {
        done();
    }); 
});

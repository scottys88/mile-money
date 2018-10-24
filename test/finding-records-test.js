const mocha = require('mocha');
const assert = require('assert');
const Athlete = require('../models/athlete');
const mongoose = require('mongoose');
//ES6 promises
mongoose.Promise = global.Promise;

describe("Find an athlete in the database", function() {
    //Adds a new athlete to the database before searching for it
    beforeEach(async function() {
        athlete = new Athlete({
            id: 123456,
            firstName: "Test First Name",
            lastName: "Test last name",
            profilePic: "www.google.com",
            city: "Adelaide",
            state: "South Australia",
            country: "Australia",
            gender: 'M'
        });
        await athlete.save();
     });
    

    //create tests
    it("Finds one record in the database by name", function() {
        return new Promise(function (resolve){
            Athlete.findOne({ firstName: "Test First Name" }).then(function(result){
                assert.ok(result.firstName === "Test First Name");
                console.log(`name saved in test: ${athlete.firstName}`);
                console.log(`name returned in findOne: ${result.firstName}`);
                resolve();
            });
        });
    });
    it("Finds one record in the database by id", function(done) {
        Athlete.findOne({ _id: athlete._id }).then(function(result){
            assert(result._id.toString() === athlete._id.toString());
            done();
        });
    });
});
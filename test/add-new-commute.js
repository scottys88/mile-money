// --- two ---
require("./finding-records-test");

const mocha = require('mocha');
const assert = require('assert');
const Athlete = require('../models/athlete');
const mongoose = require('mongoose');
//ES6 promises
mongoose.Promise = global.Promise;

describe("Adds new commute to a record", function() {

    it('Creates an author with sub-documents', function(done){

        var athlete = new Athlete({
                id: 654798541,
                firstName: "Test First Name",
                lastName: "Test last name",
                profilePic: "www.google.com",
                city: "Adelaide",
                state: "South Australia",
                country: "Australia",
                gender: 'M'
            });

            athlete.save().then(function(){
                Athlete.findOne( { id: 654798541 }).then(function(record){
                    record.commutes.push({
                        id: "1572504622",
                        start_latlng : [ -34.92, 138.6 ],
                        end_latlng : [ -34.94, 138.63 ],
                        isCommute: true,
                        account: "Main",
                        commuteType: "Run",
                        commuteName: "Regular commute"
                    });
                    record.save().then(function(){
                        findOne({ id: 654798541 }).then(function(record){
                            assert(record.commutes.length === 1);
                            done();
                    });
                });
            });
        });
    });
});

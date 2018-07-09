// --- three.js ---
require("./add-new-commute");

const mocha = require('mocha');
const assert = require('assert');
const Athlete = require('../models/athlete');
const mongoose = require('mongoose');
//ES6 promises
mongoose.Promise = global.Promise;

describe("Deleting records", function(){

        var deletingAthlete;

        beforeEach(function(done) {
            deletingAthlete = new Athlete({
                id: 2468101214161820,
                firstName: "Delete",
                lastName: "Me"
            });
            deletingAthlete.save().then(function() {
                assert(deletingAthlete.isNew === false);
                done();
            });
        });




    it("deletes an existing record", function(done){
        Athlete.findOneAndRemove({ id: 2468101214161820 }).then(function(result){
            assert(result === null);
            done();    
        });
            
    });
});
const mocha = require('mocha');
const assert = require('assert');
const Athlete = require('./models/athlete');

describe("Saving records", function() {
    //create tests
    it("Saves a record to to the database", function(done) {
        var character = new marioChar({
            name: "Mario"
        });
        character.save().then(() => {
            assert(character.isNew === false);
            done();
        });
    });
});
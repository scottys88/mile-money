const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commuteSchema = new Schema({
    id: String,
    start_latlng : [],
    end_latlng : [],
    isCommute: Boolean,
    account: String,
});

const athleteSchema = new Schema({
    id: String,
    firstName: String,
    lastName: String,
    profilePic: String,
    commutes: [commuteSchema]
})



const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
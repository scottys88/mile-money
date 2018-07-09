const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commuteSchema = new Schema({
    id: String,
    start_latlng : [],
    end_latlng : [],
    isCommute: Boolean,
    account: String,
    commuteDate: {
        type: Date,
        default: Date.now
    },
    commuteType: String,
    commuteName: {
        type: String
    }
});

const settingsSchema = new Schema({
   commuteType: String,
   fuel: Number,
   bus: Number,
   parking: Number,
   timeHours: Number,
   timeMinutes: Number
});

const athleteSchema = new Schema({
    id: { 
        type: Number,
        // unique: true,
        // dropDups: true
    },
    firstName: String,
    lastName: String,
    profilePic: String,
    city: String,
    state: String,
    country: String,
    gender: String,
    commutes: [commuteSchema],
    settings: [settingsSchema]
});



const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commuteSchema = new Schema({
    commuteId: {
        type: String,
        unique: true,
        required: true,
        sparse: true
    },
    start_latlng : [],
    end_latlng : [],
    isCommute: Boolean,
    account: {
        type: String,
        default: "Main"
    },
    commuteDate: {
        type: Date,
        default: Date.now
    },
    startDateLocal: Date,
    commuteType: String,
    commuteName: String,
    distance: Number,
    movingTime: Number,
    elapsedTime: Number


});

const settingsSchema = new Schema({
   userCommute: String,
   fuel: Number,
   bus: Number,
   parking: Number,
   timeHours: Number,
   train: Number,
   totalCost: Number,
   timeMinutes: Number
});

const shoeSchema = new Schema({
    name: String,
    distance: Number
});

const bikeSchema = new Schema({
    name: String,
    distance: Number
});

const athleteSchema = new Schema({
    id: { 
        type: Number,
        unique: true,
        required: true,
        sparse: true
    },
    firstName: String,
    lastName: String,
    profilePic: String,
    city: String,
    state: String,
    country: String,
    gender: String,
    commutes: [commuteSchema],
    settings: [settingsSchema],
    shoes: [shoeSchema],
    bikes: [bikeSchema]
});



const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
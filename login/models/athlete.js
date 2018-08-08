const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commuteSchema = new Schema({
    _id: false,
    commuteId: {
        type: Number,
        unique: true,
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
    commuteCosts: {
        type: String,
        default: 'Running commute'
    },
    distance: Number,
    movingTime: Number,
    elapsedTime: Number


});

const commuteCostSchema = new Schema({
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
    id: {
        type: String,
        unique: true,
        _id: false,
        sparse: true,
        dropDups: true
    },
    name: String,
    distance: Number
});

const bikeSchema = new Schema({
    id: {
        type: String,
        unique: true,
        sparse: true,
        dropDups: true
    },
    name: String,
    distance: Number
});

const wishListSchema = new Schema({
    itemName: String,
    itemCost: Number,
    itemURL: String,
    tags: [String],
    redeemed: Boolean
});

const accountSchema = new Schema({
    accountName: String,
    accountNotes: String,
    accountBalance: Number
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
    commuteCosts: [commuteCostSchema],
    shoes: [shoeSchema],
    bikes: [bikeSchema],
    wishList: [wishListSchema],
    accounts: [accountSchema]
});







const Commutes = mongoose.model('Commutes', commuteCostSchema);
const Shoes = mongoose.model('Shoes', shoeSchema);
const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
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
        required: [true, 'You must save a Commute Cost with a commute'],
        default: 'Main commute cost'
    },
    distance: Number,
    movingTime: Number,
    elapsedTime: Number


});

const commuteCostSchema = new Schema({
   userCommute: { 
       type: String,
       default: "Main commute cost",
       required: [true, 'Please enter a name for your commute cost']
   },
   fuel: {
       type: Number,
       max: [10000, "You're trying to enter a big number for fuel. Please make it a bit smaller (less than $10,000!)."]
   },
   bus: {
        type: Number,
        max: [5000, "That's an expensive bus ticket! The bus ticket limit here is $5000."]
   },
   parking: {
        type: Number,
        max: [5000, "I know parking can get expensive, but come on!"]
   },
   timeHours: Number,
   train: {
        type: Number,
        max: [1000, "The limit for the train ticket is $1000 which is high as it is! You should probably fly if this is the case!"]
    },
   totalCost: {
       type: Number
   },
   timeMinutes: Number,
   other: {
        type: Number,
        max: [1000, "This is the catch all for other commute types. Max is $1000"]
    }
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
    itemName: { 
        type: String,
        required: [true, 'Please make sure you enter the name for your Wishlist Item'],
        maxlength: 100
    },
    itemCost: {
        type: Number,
        required: [true, "In order to calculate your required commutes, please enter the item cost."],
        max: 50000
    },
    itemURL: String,
    tags: [String],
    redeemed: Boolean
});

const athleteSettingsSchema = new Schema({
    emailNotifications: {
        type: Boolean,
        default: false
    },
    autoUpdateCommutes: {
        type: Boolean,
        default: false
    },
    emailMarketing: {
        type: Boolean,
        default: false
    }
})

// const accountSchema = new Schema({
//     accountName: {
//         type: String,
//         default: "Main"
//     },
//     accountNotes: String,
//     accountBalance: { 
//         type: Number
//     }
// });

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
    accounts: {
        accountName: "Main",
        type: String
    },
    settings: athleteSettingsSchema,
    email: String
});







const Commutes = mongoose.model('Commutes', commuteCostSchema);
const Shoes = mongoose.model('Shoes', shoeSchema);
const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
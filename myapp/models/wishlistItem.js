const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const wishlistItemSchema = new mongoose.Schema({
	itemName: {
		type: String,
		trim: true,
		required: 'Please enter the name of the item for your wishlist'
	},
	price: {
		type: Number,
		max: [100000, 'Come on, I know you like to save money but this is nuts!'],
		required: [true, 'We need to know the value so you can know when you can buy.']
	},
	itemURL: {
		type: String,
		trim: true,
		createdDate: Date.now
	},
	slug: String,
	tags: [String]

});


wishlistItemSchema.pre('save', function(next) {
	if(!this.isModified('itemName')) {
		next(); //skip it
		return; // stop this function from running
	}
	this.slug = slug(this.itemName);
	next();
	// Todo make slugs unique
})

module.exports = mongoose.model('wishlistItem', wishlistItemSchema);
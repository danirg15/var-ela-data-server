const mongoose = require('mongoose');
const passwordHash = require('password-hash');

const UserSchema = mongoose.Schema({
	username: 	{ "type": String, "required": true, "unique": true },
	password: 	{ "type": String, "required": true },
	name: 		{ "type": String, "required": true },
	email: 		{ "type": String, "required": true }
},{
	timestamps: true
});


//--------------------------------------------
//		Indexes
//--------------------------------------------
UserSchema.index({ "field": 1 });


//--------------------------------------------
//		Middlewares
//--------------------------------------------

UserSchema.pre('save', function(next) {
	this.password = passwordHash.generate(this.password)
	next()
});

module.exports = mongoose.model('User', UserSchema);
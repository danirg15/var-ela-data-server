const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = mongoose.Schema({
	'uuid': 	{ 'type': String, 'require': true },
	'name': 	{ 'type': String, 'require': true },
	'api_key': 	{ 'type': String, 'require': true }
},{
	timestamps: true
});


//--------------------------------------------
//		Indexes
//--------------------------------------------


//--------------------------------------------
//		Middlewares
//--------------------------------------------


module.exports = mongoose.model('User', UserSchema);
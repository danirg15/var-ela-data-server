const mongoose = require('mongoose');

const SiteSchema = mongoose.Schema({
	'CHROM': 	{ 'type': String, 'default': '' },
	'POS': 		{ 'type': Number, 'default': '' },
	'ID': 		{ 'type': String, 'default': '' },
	'REF': 		{ 'type': String, 'default': '' },
	'ALT': 		{ 'type': String, 'default': '' },
	'QUAL': 	{ 'type': Number, 'default': '' },
	'FILTER': 	{ 'type': String, 'default': '' },
	'INFO': 	{ 'type': String, 'default': '' },
	'GENE': 	{ 'type': String, 'default': '' },
	'FORMAT': 	{ 'type': String, 'default': '' },
	'DATA': 	{ 'type': String, 'default': '' }
});


//--------------------------------------------
//		Indexes
//--------------------------------------------


//--------------------------------------------
//		Middlewares
//--------------------------------------------


module.exports = mongoose.model('Site', SiteSchema);
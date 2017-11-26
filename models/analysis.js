const mongoose = require('mongoose');

const AnalysisSchema = mongoose.Schema({
	'title': 		{ 'type': String, 'required': true },
	'description': 	{ 'type': String, 'required': false, 'default': ''},
	'author': 		{ 'type': String, 'required': true },
	'config': { 
		'input_file': 		{ 'type': String, 'required': true },
		'output_file': 		{ 'type': String, 'required': true },
		'min-mean-dp': 		{ 'type': Number, 'required': false, 'default': '' },
		'max-mean-dp': 		{ 'type': Number, 'required': false, 'default': '' },
		'min-quality': 		{ 'type': Number, 'required': false, 'default': '' },
		'remove-non-passing-sites': { 'type': Boolean, 'required': false, 'default': '' },
		'keep-only-indels': { 'type': Boolean, 'required': false, 'default': '' },
		'min-maf': 			{ 'type': Number, 'required': false, 'default': '' },
		'max-maf': 			{ 'type': Number, 'required': false, 'default': '' },
	},
	'progress' : {
		'percent': { 'type': Number, 'required': false, 'default': 0 },
		'stages': {
			'submit': 		{ 'type': Boolean, 'default': true },
			'filtering': 	{ 'type': Boolean, 'default': false },
			'annotating': 	{ 'type': Boolean, 'default': false },
			'stats': 		{ 'type': Boolean, 'default': false },
			'completed': 	{ 'type': Boolean, 'default': false }
		}
	},
	'failed': { 'type': Boolean, 'default': false },
	'error_message': { 'type': String, 'default': '' },
	'finishedAt':  { 'type': Date, 'default': null }
},{
	timestamps: true
});


//--------------------------------------------
//		Indexes
//--------------------------------------------


//--------------------------------------------
//		Middlewares
//--------------------------------------------


module.exports = mongoose.model('Analysis', AnalysisSchema);
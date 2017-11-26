const Joi = require('joi');
 
module.exports = {
	full: {
		  body: {
		    'title':       		Joi.string().required(),
		    'description':    	Joi.string().optional().allow(''),
		    'author': 			Joi.string().required(),
		    'config': {
		    	'min-mean-dp':   	Joi.number().optional().allow(''),
		    	'max-mean-dp':   	Joi.number().optional().allow(''),
		    	'remove-non-passing-sites': Joi.boolean().optional().allow(''),
		    	'keep-only-indels': Joi.boolean().optional().allow(''),
		    	'min-quality': 		Joi.number().min(0).max(100).optional().allow(''),
		    	'min-maf': 			Joi.number().precision(8).optional().allow(''),	
		    	'max-maf': 			Joi.number().precision(8).optional().allow(''),
		    	'input_file': 		Joi.string().required(),
		    	'output_file': 		Joi.string().required()
		    }
		  }
	}
}
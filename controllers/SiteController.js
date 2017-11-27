const Site = require('../models/site')

self = module.exports = {

    find: (options, callback) => {
    	const limit = 10
        Site.find(options).limit(limit).exec(callback)
    },

};


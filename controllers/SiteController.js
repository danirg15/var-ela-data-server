const Site = require('../models/site')

module.exports = {

    find: (options, callback) => {
    	const limit = 50
        Site.find(options).limit(limit).exec(callback)
    },

    getOne: (id, callback) => {
        Site.findById(id, callback)
    },

};


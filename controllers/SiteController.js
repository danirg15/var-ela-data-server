const Site = require('../models/site')

module.exports = {

    find: (options, callback) => {
    	const limit = 100
        let query = {}

        Object.keys(options).forEach(function(property) {
            const operator = options[property].split(',')[0]
            const value = options[property].split(',')[1]
            
            if(operator == '=') {
                query[property] = { '$eq': value }
            }
            else if(operator == '>') {
                query[property] = { '$gt': value }
            }
            else if(operator == '<') {
                query[property] = { '$lt': value }
            }
        })

        Site.find(query).limit(limit).exec(callback)
    },

    getOne: (id, callback) => {
        Site.findById(id, callback)
    },

    removeSitesOfAnalysis: (analysis_id, callback) => {
    	Site.remove({'analysis': analysis_id}, callback)
    }

};


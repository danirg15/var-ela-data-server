const Analysis = require('../models/analysis')

module.exports = {

    getAll: (options, callback) => {
        Analysis.find(options, callback)
    },

    getOne: (id, callback) => {
        Analysis.findById(id, callback)
    },

    store: (analysis, callback) => {
        (new Analysis(analysis)).save(callback)
    }, 

    destroy: (analysis_id, callback) => {
        Analysis.findByIdAndRemove(analysis_id, callback)
    },

    count: (options, callback) => {
        Analysis.count(options, callback)
    }

};


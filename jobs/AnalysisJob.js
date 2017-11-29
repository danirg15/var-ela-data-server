const async = require('async')
const Analysis = require('../models/analysis')
const AnalysisController = require('../controllers/AnalysisController')

module.exports = {

    handle: (analysis) => {

        async.waterfall([
            //Stage 2: Filteing
            function(callback) {
                AnalysisController.filtering(analysis, callback)
            },
            //Stage 3: Annotaing
            function(callback) {
                AnalysisController.annotating(analysis, callback)
            },
            //Stage 4: Stats
            function(callback) {
                AnalysisController.stats(analysis, callback)
            },
            //Stage 5: Import
            function(callback) {
                AnalysisController.import(analysis, callback)
            }
        ], function (err) {
            if (err) {
                AnalysisController.failed(analysis, err)
                throw err
            }
            else {
                AnalysisController.completed(analysis)
            }
        })

    }

};


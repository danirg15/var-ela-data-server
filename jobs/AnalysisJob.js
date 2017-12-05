const async = require('async')
const Analysis = require('../models/analysis')
const AnalysisController = require('../controllers/AnalysisController')

module.exports = {

    handle: (analysis, callback) => {

        async.waterfall([
            //Stage 1: Submit
            function(callback) {
                console.log('Submit')
                AnalysisController.submit(analysis, callback)
            },
            //Stage 2: Filtering
            function(callback) {
                console.log('Filtering')
                AnalysisController.filtering(analysis, callback)
            },
            //Stage 3: Annotating
            function(callback) {
                console.log('Annotating')
                AnalysisController.annotating(analysis, callback)
            },
            //Stage 4: Stats
            function(callback) {
                console.log('Stats')
                AnalysisController.stats(analysis, callback)
            },
            //Stage 5: Import
            function(callback) {
                console.log('Import')
                AnalysisController.import(analysis, callback)
            }
        ], function (err) {
            if (err) {
                console.log('Job Failed')
                AnalysisController.failed(analysis, err, callback)
            }
            else {
                console.log('Job Completed')
                AnalysisController.completed(analysis, callback)
            }
        })

    }

};


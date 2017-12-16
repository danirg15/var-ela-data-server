const async = require('async')
const AnalysisController = require('../controllers/AnalysisController')

module.exports =  (job, done) => {
    const analysis = job.data.analysis

    async.waterfall([
        //Stage 1: Submit
        function(callback) {
            console.log('Submit')
            AnalysisController.submit(analysis, callback)
        },
        //Stage 2: Merge
        function(callback) {
            console.log('Merge')
            AnalysisController.merge_files(analysis, callback)
        },
        //Stage 3: Filtering
        function(callback) {
            console.log('Filtering')
            AnalysisController.filtering(analysis, callback)
        },
        //Stage 4: Annotating
        function(callback) {
            console.log('Annotating')
            AnalysisController.annotating(analysis, callback)
        },
        //Stage 5: Import
        function(callback) {
            console.log('Import')
            AnalysisController.import(analysis, callback)
        },
        //Clean up
        function(callback) {
            console.log('Cleaninig up')
            AnalysisController.remove_temp_files(analysis, callback)
        }
    ], function (err) {
        if (err) {
            console.log('Job Failed')
            AnalysisController.failed(analysis, err, done)
        }
        else {
            console.log('Job Completed')
            AnalysisController.completed(analysis, done)
        }
    })

}


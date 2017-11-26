const Analysis = require('../models/analysis')
const CommandController = require('./CommandController')
const shell = require('shelljs')

self = module.exports = {

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

    update: (analysis,callback) => {
        Analysis.findByIdAndUpdate(analysis._id, { $set: analysis }, callback)
    },

    count: (options, callback) => {
        Analysis.count(options, callback)
    },

    filtering: (analysis, callback) => {
        const command = 'echo "Hello World"'//CommandController.buildFilteringCommand(analysis)
        
        shell.exec(command, function(code, stdout, stderr) {
            if (code === 0) {
                analysis.progress.stages.filtering = true
                analysis.progress.percent = 40
                self.update(analysis, (err) => { console.log(err) })
                callback(null);
            } else {
                callback("Could execute filtering stage")
            }
        })

    },

    annotating: (analysis, callback) => {
        const command = 'echo "Hello World"'//CommandController.buildFilteringCommand(analysis)
        
        shell.exec(command, function(code, stdout, stderr) {
            if (code === 0) {
                analysis.progress.stages.annotating = true
                analysis.progress.percent = 60
                self.update(analysis, (err) => { console.log(err) })
                callback(null);
            } else {
                callback("Could execute annotating stage")
            }
        })

    },

    stats: (analysis, callback) => {
        const command = 'echo "Hello World"'//CommandController.buildFilteringCommand(analysis)
        
        shell.exec(command, function(code, stdout, stderr) {
            if (code === 0) {
                analysis.progress.stages.stats = true
                analysis.progress.percent = 80
                self.update(analysis, (err) => { console.log(err) })
                callback(null);
            } else {
                callback("Could execute stats stage")
            }
        })

    },

    completed: (analysis) => {
        analysis.progress.stages.completed = true
        analysis.progress.percent = 100
        analysis.failed = false
        analysis.error_message = ""
        analysis.finishedAt = new Date()
        self.update(analysis, (err) => { console.log(err) })
    },

    failed: (analysis, message) => {
        analysis.failed = true
        analysis.error_message = message
        self.update(analysis, (err) => { console.log(err) })
    },

};


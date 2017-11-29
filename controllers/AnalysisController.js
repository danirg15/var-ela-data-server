const Analysis = require('../models/analysis')
const Site = require('../models/site')
const CommandController = require('./CommandController')
const shell = require('shelljs')
const readline = require('linebyline')

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
        console.log('Init Filtering Stage')

        const command = CommandController.buildFilteringCommand2(analysis)
        //const command = 'echo 1'

        shell.exec(command, function(code, stdout, stderr) {
            if (code === 0) {
                analysis.progress.stages.filtering = true
                analysis.progress.percent = 40
                self.update(analysis, (err) => { console.log(err) })

                console.log('Finish Filtering Stage')

                callback(null);
            } else {
                callback("Couldn't execute filtering stage")
            }
        })

    },

    annotating: (analysis, callback) => {
        console.log('Init Annotating Stage')
        const command = CommandController.buildAnnotatingCommand(analysis)
        //const command = 'echo 1'

        shell.exec(command, function(code, stdout, stderr) {
            if (code === 0) {
                analysis.progress.stages.annotating = true
                analysis.progress.percent = 60
                self.update(analysis, (err) => { console.log(err) })
                console.log('Finish Annotating Stage')
                callback(null);
            } else {
                callback("Couldn't execute annotating stage")
            }
        })

    },

    stats: (analysis, callback) => {
        console.log('Init Stats Stage')

        const command = 'echo 1'
        
        shell.exec(command, function(code, stdout, stderr) {
            if (code === 0) {
                analysis.progress.stages.stats = true
                analysis.progress.percent = 80
                self.update(analysis, (err) => { console.log(err) })

                console.log('Finish Stats Stage')

                callback(null);
            } else {
                callback("Couldn't execute stats stage")
            }
        })

    },

    import: (analysis, callback) => {
        console.log('Init Import Stage')
        const base_path = './lib/data/output/'
        const reader = readline(base_path + analysis.config['output_file']);

        reader.on('line', function(line, lineCount, byteCount) {
            //Skip VCF header lines
            if (line.substring(0,1) != '#') {
                const data = line.split('\t')
                let site_record = {
                    'CHROM': data[0],
                    'POS': data[1],
                    'ID': data[2] == '.' ? [] : data[2].split(';'),
                    'REF': data[3],
                    'ALT': data[4],
                    'QUAL': data[5],
                    'FILTER': data[6],
                    'INFO': data[7].split(';'),
                    'GENE': '',
                    'FORMAT': data[8],
                    'DATA': data[9],
                    'clinical_annotation': {
                        'cosmic':   '',
                        'clinvar':  ''
                    },
                }

                site_record['INFO'].forEach((tag) => {
                    if (tag.includes('GENE')) {
                        site_record['GENE'] = tag.split('=')[1]
                    }
                    if(tag.includes('clinvar')) {
                        site_record['clinical_annotation']['clinvar'] = tag.split('=')[1]
                    }
                    if(tag.includes('cosmic')) {
                        site_record['clinical_annotation']['cosmic'] = tag.split('=')[1]
                    }
                })
            
                let site = new Site(site_record)
                site.save((err) => {
                    if (err)  callback(err)
                })
            }
        })
        .on('end', function() {
            analysis.progress.stages.import = true
            analysis.progress.percent = 100
            self.update(analysis, (err) => { console.log(err) })

            console.log('Finish Annotating Stage')

            callback(null)
        })
        .on('error', function(e) {
            callback("Error during import stage. Stack:" + e)
        });
    },

    completed: (analysis) => {
        analysis.progress.stages.completed = true
        analysis.progress.percent = 100
        analysis.failed = false
        analysis.error_message = ""
        analysis.finishedAt = new Date()
        self.update(analysis, (err) => { console.log(err) })

        console.log('Finish Completed Stage')

    },

    failed: (analysis, message) => {
        analysis.failed = true
        analysis.error_message = message
        self.update(analysis, (err) => { console.log(err) })

        console.log('Finish Failed Stage')

    }

};


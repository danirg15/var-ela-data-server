const Analysis = require('../models/analysis')
const Site = require('../models/site')
const CommandController = require('./CommandController')
const shell = require('shelljs')
const readline = require('linebyline')
const uuid = require('uuid/v4') 
const async = require('async')
const fs = require('fs')

self = module.exports = {

    getAll: (options, callback) => {
        Analysis.find(options, callback)
    },

    getOne: (id, callback) => {
        Analysis.findById(id, callback)
    },

    store: (analysis, callback) => {
        const name = uuid()
        analysis.config.output_merged_file = name + '.merged.vcf.gz'
        analysis.config.output_filtered_file = name + '.filtered.vcf'
        analysis.config.output_annotated_file = analysis.config.output_filtered_file + '.hg19_multianno.vcf'

        let data = new Analysis(analysis)
        data.save(callback)
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

    remove_temp_files: (analysis, callback) => {
        const data_path = process.env.DATA_PATH_DIR

        async.parallel([
            function(callback) {
                const path = data_path+'/output/'+analysis.config.output_merged_file
                fs.unlink(path, callback)
            },
            function(callback) {
                const path = data_path+'/output/'+analysis.config.output_filtered_file
                fs.unlink(path, callback)
            }
        ],
        function(err) {
            callback(err)
        })
    },

    create_queue: () => {
        const Queue = require('bull')
        let genomeQueue = new Queue('Genome Analysis', 'redis://redis:6379')
        genomeQueue.process(4, require('../jobs/AnalysisJob.js'));
        return genomeQueue
    },

    submit: (analysis, callback) => {
        if (analysis.progress.stages.submit == true) {
            //If stage completed do nothing
            callback(null)
        }
        else {
            analysis.progress.stages.submit = true
            analysis.progress.percent = 0
            analysis.runnedAt = new Date()
            self.update(analysis, (err) => {
                callback(null)
            })  
        }        
    },

    merge_files: (analysis, callback) => {
        if (analysis.progress.stages.merge == true) {
            //If stage completed do nothing
            callback(null)
        }
        else {
            const command = CommandController.buildMergeFilesCommand(analysis)
            shell.exec(command, function(code, stdout, stderr) {
                if (code === 0) {
                    analysis.progress.stages.merge = true
                    analysis.progress.percent = 15
                    self.update(analysis, (err) => {
                        callback(null)
                    })
                } else {
                    callback("Couldn't execute merge stage")
                }
            })
        }        
    },

    filtering: (analysis, callback) => {
        if (analysis.progress.stages.filtering == true) {
            //If stage completed do nothing
            callback(null)
        }
        else {
            const command = CommandController.buildFilteringCommand(analysis)
            shell.exec(command, function(code, stdout, stderr) {
                if (code === 0) {
                    analysis.progress.stages.filtering = true
                    analysis.progress.percent = 30
                    self.update(analysis, (err) => {
                        callback(null)
                    })
                } else {
                    callback("Couldn't execute filtering stage")
                }
            })
        }        
    },

    annotating: (analysis, callback) => {
        if (analysis.progress.stages.annotating == true) {
            //If stage completed do nothing
            callback(null)
        }
        else {
            const command = CommandController.buildAnnotatingCommand(analysis)
            shell.exec(command, function(code, stdout, stderr) {
                if (code === 0) {
                    analysis.progress.stages.annotating = true
                    analysis.progress.percent = 45
                    self.update(analysis, (err) => {
                        callback(null)
                    })
                } else {
                    callback("Couldn't execute annotating stage")
                }
            })
        }
    },

    stats: (analysis, callback) => {
        if (analysis.progress.stages.stats == true) {
            //If stage completed do nothing
            callback(null)
        }
        else {
            const command = 'echo 1'
            shell.exec(command, function(code, stdout, stderr) {
                if (code === 0) {
                    analysis.progress.stages.stats = true
                    analysis.progress.percent = 60
                    self.update(analysis, (err) => {
                        callback(null)
                    })
                } else {
                    callback("Couldn't execute stats stage")
                }
            })
        }
    },

    import: (analysis, callback) => {
        const data_output_path = process.env.DATA_PATH_DIR + '/output/'
        const reader = readline(data_output_path + analysis.config['output_annotated_file']);
        var count = 0
        var samples = []

        reader.on('line', function(line, lineCount, byteCount) {
            //Skip VCF header lines
            if (line.substring(0,2) != '##') {
                const data = line.split('\t')

                //If it's colums header we take the sample names
                if(line.substring(0,1) == '#') {
                    for (var i = 9; i < data.length; i++) {
                        samples[i] = data[i]
                    }
                    return
                }

                let site_record = {
                    'analysis': analysis._id,
                    'CHROM':    data[0],
                    'POS':      data[1],
                    'ID':       data[2].split(';'),
                    'REF':      data[3],
                    'ALT':      data[4],
                    'QUAL':     data[5] == '.' ? '' : data[5],
                    'FILTER':   data[6],
                    'INFO':     data[7].split(';'),
                    'GENE':     '',
                    'FORMAT':   data[8],
                    'SAMPLE_DATA':     []
                }

                for (var i = 9; i < data.length; i++) {
                    site_record['SAMPLE_DATA'].push(data[i]+';' + samples[i])
                }

                site_record['INFO'].forEach((info, i) => {
                    let data = info.split('=')
                    if(data.length == 2 && data[1] != '.') {
                        site_record['INFO'][i] = data[0] + '=' + data[1].split('_').join(' ')
                        site_record['INFO'][i] = site_record['INFO'][i]
                                                .split("\\x3b")
                                                .join(';')
                                                .split("\\x3d")
                                                .join('=')

                        if (data[0] == 'Gene.refGene') {
                            site_record['GENE'] = data[1].split("\\x3b")
                        }
                    } 
                    
                })

                let site = new Site(site_record)
                site.save((err) => {
                    if (err) callback(err)
                    else count++
                })
            }
        })
        .on('end', function() {
            analysis.progress.stages.import = true
            analysis.progress.percent = 75
            analysis.result_sites_count = count
            self.update(analysis, (err) => {
                callback(null)
            })
        })
        .on('error', function(e) {
            callback("Error during import stage. Stack:" + e)
        });
    },

    completed: (analysis, callback) => {
        analysis.progress.stages.completed = true
        analysis.progress.percent = 100
        analysis.failed = false
        analysis.error_message = ""
        analysis.finishedAt = new Date()
        self.update(analysis, (err) => { 
            callback(null)
        })
    },

    failed: (analysis, message, callback) => {
        analysis.failed = true
        analysis.error_message = message
        self.update(analysis, (err) => { 
            callback(null)
        })
    }

};


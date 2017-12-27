const router = require('express').Router()
const AnalysisController = require('../controllers/AnalysisController')
const validate = require('express-validation');
const validators = require('./validators');
const async = require('async')
const fs = require('fs')
const genomeQueue = AnalysisController.create_queue()

router.post('/', validate(validators.analysis.full), (req, res) => {
	AnalysisController.store(req.body, (err, obj) => {
		if (err) res.status(500).json(err)
        else res.status(201).json({
        	'message': 'Analysis Submitted',
        	'obj': obj
        })
	})
})


router.post('/:id/run', (req, res) => {
	AnalysisController.getOne(req.params.id, (err, analysis) => {
		if (err) res.status(500).json(err)
        else {
        	genomeQueue.add({'analysis': analysis})
        	res.status(200).json({'message': 'Job running!'})
        }
	})
})

router.get('/:id', (req, res) => {
	AnalysisController.getOne(req.params.id, (err, analysis) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(analysis)
	})
})

router.delete('/:id', (req, res) => {
	async.waterfall([
	    function(callback) {
	    	AnalysisController.getOne(req.params.id, callback)
	    },
	    function(analysis, callback) {
	    	AnalysisController.destroy(analysis._id, (err) => {
	    		callback(err, analysis)
	    	})
	    },
	    function(analysis, callback) {
	    	AnalysisController.remove_analysis_files(analysis, (err) => {
	    		callback(err)
	    	})
	    }
	], (err) => {
		console.log(err)
	    if (err) res.status(500).json(err)
	    else res.status(200).json({})
	})
})

router.get('/:id/download/:type', (req, res) => {
	const data_output_path = process.env.DATA_PATH_DIR + '/output/'
	const output_type = req.params.type

	AnalysisController.getOne(req.params.id, (err, analysis) => {
		if (err) {
			res.status(500).json(err)
		}
		else if(output_type != 'vcf' && output_type != 'txt') {
			res.status(400).json({'error': 'Bad type'})
		}
        else {

        	if (output_type == 'vcf') {
        		var file = data_output_path + analysis.config.output_annotated_file
        	}
        	else {
        		var file = data_output_path + analysis.config.output_annotated_file
        		file = file.slice(0, -3)
        		file += 'txt'
        	}	

        	res.status(200).download(file)
        }
	})
})

router.post('/:id/input-files', validate(validators.analysis.files), (req, res) => {
	let data = {
		'_id': req.params.id,
		'config.input_files': req.body.files
	}

	AnalysisController.update(data, (err) => {
		if (err) res.status(500).json(err)
        else res.status(200).json({})
	})
})

router.get('/', (req, res) => {
	AnalysisController.getAll((err, analysis) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(analysis)
	})
})


module.exports = router;
let router = require('express').Router()
let AnalysisController = require('../controllers/AnalysisController')
let validate = require('express-validation');
let validators = require('./validators');

router.post('/', validate(validators.analysis.full), (req, res) => {
	AnalysisController.store(req.body, (err, obj) => {
		if (err) res.status(500).json(err)
        else res.status(201).json({
        	'message': 'Analysis Submitted',
        	'obj': obj
        })
	})
})

router.get('/:id', (req, res) => {
	AnalysisController.getOne(req.params.id, (err, analysis) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(analysis)
	})
})

router.get('/:id/download', (req, res) => {
	AnalysisController.getOne(req.params.id, (err, analysis) => {
		if (err) {
			res.status(500).json(err)
		}
        else {
        	var file = __dirname + '/../lib/data/output/' + analysis.config.output_annotated_file
        	res.status(200).download(file)
        }
	})
})

router.post('/:id/input-files', validate(validators.analysis.files), (req, res) => {
	let data = {
		'_id': req.params.id,
		'config.input_file': req.body.files
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
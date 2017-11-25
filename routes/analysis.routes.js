let router = require('express').Router()
let AnalysisController = require('../controllers/AnalysisController')
let validate = require('express-validation');
let validators = require('./validators');

router.post('/', validate(validators.analysis.full), (req, res) => {
	AnalysisController.store(req.body, (err) => {
		if (err) res.status(500).json(err)
        else res.status(201).json({'message': 'Analysis Submitted'})
	})
})

router.get('/:id', (req, res) => {
	AnalysisController.getOne(req.params.id, (err, analysis) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(analysis)
	})
})


router.get('/', (req, res) => {
	AnalysisController.getAll((err, analysis) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(analysis)
	})
})

module.exports = router;
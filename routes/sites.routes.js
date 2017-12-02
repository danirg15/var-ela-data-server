let router = require('express').Router()
let SiteController = require('../controllers/SiteController')
let validate = require('express-validation');
let validators = require('./validators');

router.get('/:id', (req, res) => {
	SiteController.getOne(req.params.id, (err, site) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(site)
	})
})

router.get('/', (req, res) => {
	SiteController.find(req.query, (err, analyses) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(analyses)
	})
})

module.exports = router;
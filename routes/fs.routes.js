let router = require('express').Router()
let validate = require('express-validation');
let shell = require('shelljs')

router.get('/explore', (req, res) => {	
	const data_path = process.env.DATA_PATH_DIR || 'lib/data/input'

	let files_list = shell.find(data_path).filter(function(file) {
		if(req.query.name) {
			const regex = new RegExp(req.query.name, 'gi');
			return file.match(regex) && file.match(/\.vcf.gz$/)
		}
		else {  
			return file.match(/\.vcf.gz$/)
		}
	})

	let listing = []
	files_list.forEach((file) => {
		listing.push(file.replace(data_path, ''))
	})

	res.status(200).json(listing)
})

module.exports = router;
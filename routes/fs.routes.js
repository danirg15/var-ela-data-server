const router = require('express').Router()
const validate = require('express-validation');
const shell = require('shelljs')

router.get('/explore', (req, res) => {	
	const data_input_path = process.env.DATA_PATH_DIR + '/input'

	let files_list = shell.find(data_input_path).filter(function(file) {
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
		listing.push(file.replace(data_input_path, ''))
	})

	res.status(200).json(listing)
})

module.exports = router;
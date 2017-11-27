const readline = require('linebyline')

reader = readline("./data/output/output.genome.vcf");

reader.on('line', function(line, lineCount, byteCount) {
	//Skip VCF header lines
	if (line.substring(0,1) != '#') {
		const data = line.split('\t')

		let site = {
			'CHROM': data[0],
			'POS': data[1],
			'ID': data[2],
			'REF': data[3],
			'ALT': data[4],
			'QUAL': data[5],
			'FILTER': data[6],
			'INFO': data[7] == '.' ? '' : data[7],
			'FORMAT': data[8],
			'DATA': data[9]
		}

		console.log(site)

	}
})
.on('end', function() {
	console.log("finsied")
})
.on('error', function(e) {
	throw e
});
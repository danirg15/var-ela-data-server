
const analysis = {
	'config': {
		'title': 'test123',
		'description': 'lorem ipsum',
		'min-mean-dp': 3,
		'max-mean-dp': 10,
		'min-quality': 50,
		'remove-non-passing-sites': true,
		'keep-only-indels': true,
		'min-maf': 0.00001,
		'max-maf': 0.00002,
	}
}


const input="./data/input/LP6008242-DNA_A01.genome.vcf.gz"
const output="./data/output/output.genome.vcf.gz"

let command = "vcftools --temp ./tmp --gzvcf " + input

if (analysis.config['min-mean-dp'] != '') {
	command += ' --min-meanDP ' + analysis.config['min-mean-dp']
}
if (analysis.config['max-mean-dp'] != '') {
	command += ' --max-meanDP ' + analysis.config['max-mean-dp']
}
if (analysis.config['min-quality'] != '') {
	command += ' --minQ ' + analysis.config['min-quality']
}
if (analysis.config['min-maf'] != '') {
	command += ' --maf ' + analysis.config['min-maf']
}
if (analysis.config['max-maf'] != '') {
	command += ' --max-maf ' + analysis.config['max-maf']
}

if (analysis.config['remove-non-passing-sites'] == true) {
	command += ' --remove-filtered-all '
}

if (analysis.config['keep-only-indels'] == true) {
	command += ' --keep-only-indels '
}
else {
	command += ' --remove-indels '
}

command += ' --recode --stdout | gzip -c > ' + output

//console.log(command)

const shell = require('shelljs')

shell.exec(command, function(code, stdout, stderr) {
  
  if (code === 0) {
  	console.log('success');
  }
  else {
  	console.log('fail');
  }
  
  console.log('Program output:', stdout);
  console.log('Program stderr:', stderr);
});













module.exports = {

    buildFilteringCommand: (analysis) => {
        
        let command = "vcftools --gzvcf " + analysis.config['input_file']

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

        command += ' --recode --stdout | gzip -c > ' + analysis.config['output_file']

        return command
    }

};


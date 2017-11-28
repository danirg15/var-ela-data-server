const base_path = './lib/data'

module.exports = {

    buildAnnotatingCommand: (analysis) => {
        let command = 'bcftools annotate'
        command += ' -a ' + base_path + '/hg19.bed.gz'
        command += ' -c CHROM,FROM,TO,GENE '
        command += ' -h ' + base_path + '/hg19header.hdr '
        command += base_path + '/output/' + analysis.config['output_file']+'.gz'
        command += ' > ' + base_path + '/output/' + analysis.config['output_file']

        return command
    },

    buildFilteringCommand: (analysis) => {        
        let command = "vcftools --gzvcf " + base_path + '/input/' + analysis.config['input_file']

        if (analysis.config['min-mean-dp'] != '' && analysis.config['min-mean-dp'] != null) {
            command += ' --min-meanDP ' + analysis.config['min-mean-dp']
        }
        if (analysis.config['max-mean-dp'] != '' && analysis.config['max-mean-dp'] != null) {
            command += ' --max-meanDP ' + analysis.config['max-mean-dp']
        }
        if (analysis.config['min-quality'] != '' && analysis.config['min-quality'] != null) {
            command += ' --minQ ' + analysis.config['min-quality']
        }
        if (analysis.config['min-maf'] != '' && analysis.config['min-maf'] != null) {
            command += ' --maf ' + analysis.config['min-maf']
        }
        if (analysis.config['max-maf'] != '' && analysis.config['max-maf'] != null) {
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

        //command += ' --recode --stdout > ' + base_path + '/output/' + analysis.config['output_file']
        command += ' --recode --stdout | gzip -c > ' + base_path + '/output/' + analysis.config['output_file']+'.gz'

        return command
    }

};


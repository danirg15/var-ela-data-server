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

    buildFilteringCommand2: (analysis) => {        
        let query = ''

        if (analysis.config['min-dp'] != '' && analysis.config['min-dp'] != null) {
            query += ' DP >= ' + analysis.config['min-dp']
        }
        if (analysis.config['max-dp'] != '' && analysis.config['max-dp'] != null) {
            if(query.length > 0) 
                query += ' && '
            query += ' DP <= ' + analysis.config['max-dp']
        }
        if (analysis.config['min-quality'] != '' && analysis.config['min-quality'] != null) {
            if(query.length > 0) 
                query += ' && '
            query += ' %QUAL >= ' + analysis.config['min-quality']
        }
        if (analysis.config['max-maf'] != '' && analysis.config['max-maf'] != null) {
            if(query.length > 0) 
                query += ' && '
            query += ' MAF <= ' + analysis.config['max-maf']
        }
        if (analysis.config['min-maf'] != '' && analysis.config['min-maf'] != null) {
            if(query.length > 0) 
                query += ' && '
            query += ' MAF >= ' + analysis.config['min-maf']
        }
        if (analysis.config['remove-non-passing-sites'] == true) {
            if(query.length > 0) 
                query += ' && '
            query += ' %FILTER="PASS" '
        }
        if (analysis.config['site-types'].length > 0) {
            if(query.length > 0) 
                query += ' && '

            let types = analysis.config['site-types']
            
            if (types.length == 1) {
                query += ' TYPE="' + types[0] + '"'
            }
            else { 
                for (let i = 0; i < types.length; i++) {
                    //first
                    if(i == 0) {
                        query += '(TYPE="' + types[i] + '" ||'
                    }
                    //last
                    else if(i == (analysis.config['site-types'].length - 1)) {
                        query += ' TYPE="' + types[i] + '")'
                    }
                    else {
                        query += ' TYPE="' + types[i] + '" || '
                    }
                }
            }
        }
            
        let command = "bcftools filter -i'" + query + "'"
        command += " --output " + base_path + '/output/' + analysis.config['output_file']+'.gz'
        command += " --output-type z " //gzipped
        command += base_path + '/input/' + analysis.config['input_file']

        return command
    },

    /*buildFilteringCommand: (analysis) => {        
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
        command += ' --recode --recode-INFO-all '
        command +=' --stdout | gzip -c > ' + base_path + '/output/' + analysis.config['output_file']+'.gz'

        return command
    }*/

};


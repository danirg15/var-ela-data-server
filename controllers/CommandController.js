const data_path = './lib/data'
const annovar_path = './lib/annovar'

module.exports = {

    buildAnnotatingCommand: (analysis) => {
        let command = 'perl ' + annovar_path +'/table_annovar.pl '
        command += data_path + '/output/' + analysis.config['output_file'] + ' '
        command += annovar_path + '/humandb '
        command += ' -buildver hg19'
        command += ' -vcfinput '
        command += ' -out ' + data_path + '/output/' + analysis.config['output_file']
        command += ' -tempdir ' + annovar_path + '/tmp' 
        command += ' -remove'
        command += ' -protocol refGene,dbnsfp30a'
        command += ' -operation gx,f'
        command += ' -nastring .'
        command += ' -polish'
        command += ' -xref ' +  annovar_path + '/example/gene_fullxref.txt'  
  
        return command
    },

    buildFilteringCommand: (analysis) => {        
        let query = ' '//Needed space to avoid bfctools error with empty query

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
        command += " --output " + data_path + '/output/' + analysis.config['output_file'] + ' '
        command += data_path + '/input' + analysis.config['input_file'][0]

        return command
    },


};


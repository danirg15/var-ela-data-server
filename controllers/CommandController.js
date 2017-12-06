const data_path = './lib/data'
const annovar_path = './lib/annovar'

module.exports = {

    buildMergeFilesCommand: (analysis) => {
        //If there is only file, no need to merge, so just
        //copy file to output renamed
        if(analysis.config.input_files.length == 1) {
            let command = 'cp '
            command += data_path + '/input' + analysis.config.input_files[0] + ' '
            command += data_path+'/output/'+analysis.config['output_merged_file']
            return command
        }
        else if(analysis.config.input_files.length > 1) {

            //To merge files, firstly the need to be indexed with tabix
            let tabix_command = 'echo 1'
            analysis.config.input_files.forEach((file) => {
                tabix_command += ' && tabix -f -s 1 -b 2 ' + data_path + '/input' + file
            })

            //Actual merge command
            let merge_command = 'bcftools merge --output-type z'
            merge_command += ' --output ' + data_path + '/output/' + analysis.config['output_merged_file']
            
            analysis.config.input_files.forEach((file) => {
                merge_command += ' ' + data_path + '/input' + file
            })

            return tabix_command + ' && ' + merge_command
        }
        else {
            throw new Error('No input files in Merge Stage')
        }
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
        command += " --output " + data_path + '/output/' + analysis.config['output_filtered_file'] + ' '
        command += data_path + '/output/' + analysis.config['output_merged_file']

        return command
    },


    buildAnnotatingCommand: (analysis) => {
        let command = 'perl ' + annovar_path +'/table_annovar.pl '
        command += data_path + '/output/' + analysis.config['output_filtered_file'] + ' '
        command += annovar_path + '/humandb '
        command += ' -buildver hg19'
        command += ' -vcfinput '
        command += ' -out ' + data_path + '/output/' + analysis.config['output_filtered_file']
        command += ' -tempdir ' + annovar_path + '/tmp' 
        command += ' -remove'
        command += ' -protocol refGene,dbnsfp30a'
        command += ' -operation gx,f'
        command += ' -nastring .'
        command += ' -polish'
        command += ' -xref ' +  annovar_path + '/example/gene_fullxref.txt'  
  
        return command
    }

    
};


#!/bin/bash

vcf-concat ./data/output/output.genome.vcf.gz ./data/output/output2.genome.vcf.gz | gzip -c > out_concat.vcf.gz

# vcftools --gzvcf $input --get-INFO clinvar
#bcftools annotate --remove POS ./data/output/output.genome.vcf --output-type v > test.vcf 
#vcf-subset -c ID ./data/output/output.genome.vcf.gz | tr "\t" "," > ./test/out.vcf
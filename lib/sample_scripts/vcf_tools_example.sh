#!/bin/bash

# --keep-only-indels 
# --remove-indels

input="./data/input/LP6008242-DNA_A01.genome.vcf.gz"
output="./data/output/output.genome.vcf.gz"


vcftools --gzvcf $output \
		--remove-indv LP6008242-DNA_A01 \
		--recode \
		--stdout > test.vcf

#--keep-INFO GENE \ 
# vcftools --gzvcf $output \
# 		--depth


		
		#--recode \
		#--recode-INFO-all \
		

# vcftools --gzvcf $input \
# 		--min-meanDP 3 \
# 		--max-meanDP 10 \
# 		--minQ 30 \
# 		--remove-filtered-all \
# 		--remove-indels \
# 		--recode \
# 		--stdout | bgzip -c > $output

# du -ha data/
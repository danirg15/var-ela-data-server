#!/bin/bash

# --keep-only-indels 
# --remove-indels

input="./data/input/LP6008242-DNA_A01.genome.vcf.gz"
output="./data/output/output.genome.vcf"

	
vcftools --gzvcf $input \
		--min-meanDP 3 \
		--max-meanDP 10 \
		--minQ 30 \
		--remove-filtered-all \
		--remove-indels \
		--recode \
		--stdout > $output

# du -ha data/

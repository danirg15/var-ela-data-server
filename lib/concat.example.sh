#!/bin/bash

# file1="./data/output/output2.genome.vcf.gz"
# file2="./data/output/output3.genome.vcf.gz"
file1="./data/input/LP6008242-DNA_A01.genome.vcf.gz"
file2="./data/input/LP6008310-DNA_E01.genome.vcf.gz"

# tabix -s 1 -b 2 $file1
# tabix -s 1 -b 2 $file2
#-naive
#Test Merge
bcftools concat --output-type z --output merged.vcf.gz $file1 $file2
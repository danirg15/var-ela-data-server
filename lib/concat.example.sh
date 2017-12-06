#!/bin/bash

# file1="./data/output/output2.genome.vcf.gz"
# file2="./data/output/output3.genome.vcf.gz"
file1="./data/output/output.A01.vcf.gz"
file2="./data/output/output.E01.vcf.gz"

tabix -s 1 -b 2 $file1
tabix -s 1 -b 2 $file2
#-naive
#Test Merge
bcftools merge --output-type z --output merged.output.vcf $file1 $file2
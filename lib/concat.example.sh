#!/bin/bash

file1="./data/input/sample1.vcf.gz"
file2="./data/input/sample2.vcf.gz"
# file1="./data/input/LP6008242-DNA_A01.genome.vcf.gz"
# file2="./data/input/LP6008310-DNA_E01.genome.vcf.gz"

tabix -f -s 1 -b 2 $file1 && tabix -f -s 1 -b 2 $file2
#-naive
#Test Merge
bcftools merge --output-type v --output merged.output.vcf $file1 $file2
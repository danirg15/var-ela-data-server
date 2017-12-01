#!/bin/bash

output="./data/output/output.genome.vcf.gz"

bcftools stats --depth 11,12,10 $output
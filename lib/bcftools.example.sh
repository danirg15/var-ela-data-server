#!/bin/bash


input="./data/input/LP6008242-DNA_A01.genome.vcf.gz"

#MAF[0]<0.05    .. select rare variants at 5% cutoff
# TYPE for variant type in REF,ALT columns (indel,snp,mnp,ref,bnd,other). Use the regex operator "\~" to require at least one allele of the given type or the equal sign "=" to require that all alleles are of the given type. Compare
# TYPE="snp"
# TYPE~"snp"
# TYPE!="snp"

bcftools filter -i'%QUAL > 30 && DP >= 3 && DP<=10 && %FILTER="PASS" && TYPE="snp"' -o test.vcf --output-type z  $input


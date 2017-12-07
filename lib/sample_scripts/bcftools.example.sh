#!/bin/bash


input="./data/input/LP6008310-DNA_E01.genome.vcf.gz"

#MAF[0]<0.05    .. select rare variants at 5% cutoff
# TYPE for variant type in REF,ALT columns (indel,snp,mnp,ref,bnd,other). Use the regex operator "\~" to require at least one allele of the given type or the equal sign "=" to require that all alleles are of the given type. Compare
# TYPE="snp"
# TYPE~"snp"
# TYPE!="snp"

# bcftools filter -i'%QUAL > 50 && DP >= 3 && DP<=7 && %FILTER="PASS" && TYPE="snp"' -o ./data/output/output.E01.vcf --output-type z  $input


bcftools filter -i '%QUAL > 100 && DP<=7 ' ./merged.output.vcf.gz


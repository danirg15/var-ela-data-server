# cut -f1,2,3,4 < hg19.bed > example.bed
#sort -k1,1 -k2,2n ./data/hg19.bed > ./data/hg19.bed.sorted
# bgzip example.sorted.bed
# tabix -s 1 -b 2 -e 3 example.sorted.bed.gz

bcftools annotate \
  -a "./data/hg19.bed.gz" \
  -c CHROM,FROM,TO,GENE \
  -h <(echo '##INFO=<ID=GENE,Number=1,Type=String,Description="Gene name">') \
  "./data/output/output.genome.vcf.gz" > test_annotante.vcf

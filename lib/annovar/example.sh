#!/bin/bash

# perl annotate_variation.pl -buildver hg19 -downdb -webfrom annovar refGene humandb/

# perl annotate_variation.pl -buildver hg19 -downdb -webfrom annovar dbnsfp30a humandb/


perl table_annovar.pl \
		example/ex2.vcf \
		humandb/ \
		-buildver hg19 \
		-vcfinput \
		-out example.out.vcf \
		-tempdir tmp \
		-remove \
		-protocol refGene,dbnsfp30a \
		-operation gx,f \
		-nastring . \
		-polish \
		-xref example/gene_fullxref.txt

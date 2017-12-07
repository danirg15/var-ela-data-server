#!/bin/bash

# perl annotate_variation.pl -buildver hg19 -downdb -webfrom annovar refGene humandb/

# perl annotate_variation.pl -buildver hg19 -downdb -webfrom annovar dbnsfp30a humandb/


perl table_annovar.pl \
		../data/output/afd17b2a-fb76-434a-b3c0-e7cc154a10d2.filtered.vcf \
		humandb/ \
		-buildver hg19 \
		-vcfinput \
		-out example.out.vcf \
		-tempdir tmp \
		-remove \
		-protocol refGene,dbnsfp30a \
		-operation g,f \
		-nastring . \
		-polish \
		#-xref example/gene_fullxref.txt
		#-operation gx,f \

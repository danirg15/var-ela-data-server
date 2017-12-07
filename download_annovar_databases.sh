#!/bin/bash

echo "DOWNLOADING ANNOVAR DATABASES..."

annovar_path=lib/annovar

perl ${annovar_path}/annotate_variation.pl \
		-buildver hg19 \
		-downdb \
		-webfrom annovar \
		refGene ${annovar_path}/humandb

perl ${annovar_path}/annotate_variation.pl \
		-buildver hg19 \
		-downdb \
		-webfrom annovar \
		dbnsfp30a ${annovar_path}/humandb

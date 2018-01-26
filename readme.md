# VAR ELA Data Server

It's an application to execute genomic analyses over VCF files, focused on ease task like filtering and annotating several sample files. This software module is intended for being installed were data is hosted, instead of bring the data to the app. 
Let's say we want to perform analyses with VCF files stored in a remote machine,  We just install this module in the machine and using [var-ela-app-server](https://gitlab.com/dani.rg15/var-ela-app-server "") web client is a breeze to perform ad-hoc analyses against those VCF files.


# Dependencies
#### BCFTools
https://samtools.github.io/bcftools/bcftools.html
	 
BCFtools is a set of utilities that manipulate variant calls in the Variant Call Format (VCF) and its binary counterpart BCF. All commands work transparently with both VCFs and BCFs, both uncompressed and BGZF-compressed.

BCFTools is used to filter VCF files based on filters defined by users, as well as other tasks like merging VCF files.

#### Annovar
 http://annovar.openbioinformatics.org/en/latest/

ANNOVAR is an efficient software tool to utilize update-to-date information to functionally annotate genetic variants detected from diverse genomes (including human genome hg18, hg19, hg38, as well as mouse, worm, fly, yeast and many others).
ANNOVAR is used to add extra information to the sample VCF files, like Gene annotations, references to multiple clinical databases, etc...

# API
This app provides an REST API which is used by a web client like [var-ela-app-server](https://gitlab.com/dani.rg15/var-ela-app-server ""), to defined analyses, or perform searches in already completed analyses.

##### Analysis
* Create a new analysis.
	**POST** /api/analysis
* Execute an analysis
	**POST** /api/analysis/:id/run
* Get an analysis
	**GET** /api/analysis/:id
* Delete an analysis
	**DELETE** /api/analysis/:id
* Download analysis results in VCF & TXT
	**GET** /api/analysis/:id/download/:type
* Set files to perform the analysis with
	**PUT** /api/analysis/:id/input-files

##### Sites
* Get details of a site
	**GET** /api/sites/:id
* Search over sites
	**GET** /api/sites
	*Note: Filters pased as query params. e.g: ?GENE=ALLX & ALT=T & QUAL=70


##### Filesystem
* Explore local filesystem to select which files are used in the analysis. In .env is defined which folder can be explored by the web client. By default ./lib/data

    **GET** /api/fs/explore
	*Note: Only gzipped vcf files are listed, no other format is allowed.


# Stages
Once a job is launched, 6 stages are executed:

1. **Submit**: The job is active and gets queued.

2. **Merge**: If multiple VCF were selected for the analysis, they are merged using BCFTools. Nothing is done when there is only one file.

3. **Filtering**: The merged file is filtered using the filters defined by the user, like Minimun Quality, Variant Type, Genotype depth...

4. **Annotating**: Using the previous filtered VCF file, ANNOVAR is used to add extra information as:
    - Gene-based annotation with human reference hg19.
	- Region-based annotation
	- Filter-based annotation
	
        -**Databases**: whole-exome SIFT, PolyPhen2 HDIV, PolyPhen2 HVAR, LRT, MutationTaster, MutationAssessor, FATHMM, MetaSVM, MetaLR, VEST, CADD, GERP++, DANN, fitCons, PhyloP and SiPhy scores from dbNSFP version 3.0a

	    **Important**: Due to the heavy task of this stage, a big VCF input file could make this stage to break in case of insufficient memory.
	
5. **Import**: The generated VCF annotated file is imported into database to perform searches later on.

6. **Completed (or Failed)**: At this stage the job is updated with result status, error messages, etc....


# Use
The application runs inside a Docker containaer, so to deploy this app just run the following commands.

#### Install docker
```sh
$ sudo apt -y install docker docker-compose
```

#### Clone git repo
```sh
$ git clone https://gitlab.com/dani.rg15/var-ela-data-server.git
```

#### Run app

This process may take several minutes because the ANNOVAR databases are downloaded as well during the deployment.

```sh
$ cd var-ela-data-server
$ sudo docker-compose up
```
The app will run in port 5000 by default, this can be changed in .env


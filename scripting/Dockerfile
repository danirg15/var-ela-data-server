FROM ubuntu:16.04

MAINTAINER Daniel Ramirez

RUN apt-get -qq update \
    && apt-get install -y locales \
    && locale-gen en_US.UTF-8

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get install -y default-jre
RUN apt-get install -y python-minimal
RUN apt-get install -y vcftools
RUN apt-get install -y bcftools

WORKDIR /home

FROM ubuntu:16.04

MAINTAINER Daniel Ramirez

RUN apt-get -qq update \
    && apt-get install -y locales \
    && locale-gen en_US.UTF-8

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get install -y bcftools

RUN apt-get install -y wget
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g nodemon
RUN npm install
RUN download_annovar_databases.sh

WORKDIR /home

CMD ["nodemon", "server.js"]

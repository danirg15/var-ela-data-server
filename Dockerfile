FROM ubuntu:16.04

MAINTAINER Daniel Ramirez

RUN apt-get -qq update \
    && apt-get install -y locales \
    && locale-gen en_US.UTF-8 \
    && apt-get install -y bcftools wget curl

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

WORKDIR /home
COPY package.json .
RUN npm install --quiet
RUN npm install -g nodemon
COPY . .

CMD ["nodemon", "server.js"]

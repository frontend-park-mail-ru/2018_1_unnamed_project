#!/bin/bash

cd /home/gabolaev/2018_1_unnamed_project
if [ ! -z $1 ]; then
	git checkout $1
	git pull origin $1
else
	git checkout master
	git pull origin master
fi

docker rm $(docker ps -aq) -f
docker-compose up --build

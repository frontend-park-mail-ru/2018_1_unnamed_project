#!/bin/bash

cd /home/gabolaev/2018_1_unnamed_project
if [ ! -z $1 ]; then
	git pull origin $1
else
	git pull origin master
fi

docker rm $(docker ps -aq) -f
docker-compose up --build

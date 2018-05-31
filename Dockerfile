FROM ubuntu:17.10
MAINTAINER George Gabolaev
MAINTAINER Artem Ikchurin
MAINTAINER Kirill Kucherov
MAINTAINER Oleg Venger

RUN apt -y update
RUN apt -y install curl 
RUN curl -sL https://deb.nodesource.com/setup_9.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt install -y nodejs
ADD ./ /opt
WORKDIR /opt
RUN npm i npm@latest -g

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
ADD shipcollision.conf /etc/nginx/conf.d/
RUN mkdir -p /etc/letsecnrypt/live/shipcollision.me
EXPOSE 80 443

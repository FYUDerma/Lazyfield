FROM nginx:alpine

RUN mkdir /srv/website

COPY configs/nginx.conf /etc/nginx/conf.d/default.conf

COPY . /srv/website/
############
### prod ###
############

# base image
FROM nginx:1.17-alpine

COPY docker/nginx-custom.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

RUN rm -rf /usr/share/nginx/html/*
COPY dist/adzapier-analytics-ng /usr/share/nginx/html

RUN addgroup appGroup \
 && adduser -D -G appGroup appUser \
 && mkdir -p /var/run/nginx /var/tmp/nginx /var/cache/nginx /var/log/nginx /data/nginx/cache \
 && chown -R appUser:appGroup /app && chmod -R 755 /app \
 && chown -R appUser:appGroup /usr/share/nginx /var/run/nginx /var/tmp/nginx /var/cache/nginx /var/log/nginx /data/nginx/cache

USER appUser

# run nginx
CMD ["nginx", "-g", "daemon off;"]


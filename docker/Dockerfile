############
### prod ###
############

# base image
FROM nginx:1.19-alpine

RUN  rm -rf /usr/share/nginx/html/* \
  && addgroup appGroup \
  && adduser -D -G appGroup appUser \
  && mkdir -p /var/run/nginx /var/tmp/nginx /var/cache/nginx /var/log/nginx /data/nginx/cache

COPY docker/nginx-custom.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/security-headers.conf
COPY dist/adzapier-analytics-ng /usr/share/nginx/html
WORKDIR /app

#test the Nginx configuration
RUN nginx -t \
 && chown -R appUser:appGroup /app && chmod -R 755 /app \
 && chown -R appUser:appGroup /usr/share/nginx /var/run/nginx /var/tmp/nginx /var/cache/nginx /var/log/nginx /data/nginx/cache /etc/nginx

USER appUser

# run nginx
CMD ["nginx", "-g", "daemon off;"]

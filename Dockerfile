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
 && mkdir -p /var/run/nginx /var/tmp/nginx /var/cache/nginx /var/log/nginx \
 && chown -R appUser:appGroup /app && chmod -R 755 /app \
 && chown -R appUser:appGroup /usr/share/nginx /var/run/nginx /var/tmp/nginx /var/cache/nginx /var/log/nginx

USER appUser

# run nginx
CMD ["nginx", "-g", "daemon off;"]

# ############
# ### prod ###
# ############

# # base image
# FROM nginx:1.17-alpine

# # copy artifact build from the 'build environment'
# # COPY --from=build /app/dist /usr/share/nginx/html

# # expose port 80
# EXPOSE 80
# RUN rm -rf /usr/share/nginx/html/*
# COPY dist/adzapier-analytics-ng /usr/share/nginx/html
# # COPY docker/nginx-custom.conf /etc/nginx/conf.d/default.conf
# COPY docker/nginx.conf /etc/nginx/nginx.conf

# # run nginx
# CMD ["nginx", "-g", "daemon off;"]
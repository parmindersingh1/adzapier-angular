############
### prod ###
############

# base image
FROM nginx:1.17-alpine

# copy artifact build from the 'build environment'
# COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80
RUN rm -rf /usr/share/nginx/html/*
COPY dist/adzapier-analytics-ng /usr/share/nginx/html
# COPY docker/nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf

# run nginx
CMD ["nginx", "-g", "daemon off;"]
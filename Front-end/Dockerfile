FROM nginx:alpine

# Create the directory for the website
RUN mkdir -p /srv/website

# Copy the nginx configuration file
COPY configs/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the front-end build files to the website directory
COPY dist/ /srv/website/

# Expose the port nginx will run on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
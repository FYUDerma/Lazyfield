# Use of the latest Alpine image
FROM debian:latest

# Install the necessary packages for the database 
# The Database used is postgresql
RUN apt update && apt install -y \
    postgresql \
    postgresql-contrib

# Copy the database initialization script to the container
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the port 5432
EXPOSE 5432
# Use the official PostgreSQL image
FROM postgres:latest

# Copy the database initialization script to the container
COPY ./init.sql /docker-entrypoint-initdb.d/init.sql

# Expose the port 5432
EXPOSE 5432
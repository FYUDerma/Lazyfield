# Use the official Node.js image as the base image
FROM node:18

# Install nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the necessary ports
EXPOSE 8080

# Start the application
CMD ["npx", "vite", "--port", "8080", "--host", "0.0.0.0"]
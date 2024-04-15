# Use the official Nginx image
FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# COPY frontend /var/www/app

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

# Use the official Nginx image
FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# Install openssl (if not already installed)
RUN apt-get update && apt-get install -y openssl

# Generate self-signed SSL certificate
RUN openssl req -newkey rsa:2048 -nodes -keyout /etc/ssl/server.key \
	-x509 -days 365 -subj "/CN=localhost /O=1337 /OU=1337" -out /etc/ssl/server.crt

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

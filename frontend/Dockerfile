# Gunakan image nginx untuk serve static file
FROM nginx:alpine

# Copy semua file frontend ke direktori default nginx
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx akan otomatis serve file di /usr/share/nginx/html
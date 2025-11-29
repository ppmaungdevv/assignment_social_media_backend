FROM mysql:8.0

RUN chown -R mysql:root /var/lib/mysql/

# Copy the SQL initialization script into the container
COPY mysql-init.sql /docker-entrypoint-initdb.d/mysql-init.sh

# Make the script executable
RUN chmod +x /docker-entrypoint-initdb.d/mysql-init.sh

EXPOSE 3306
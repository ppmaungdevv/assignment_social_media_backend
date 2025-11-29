#!/bin/bash

# Wait for MySQL to start
until mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "SELECT 1"; do
    sleep 1
done

mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE mydb;"

# Create the new user with 'mysql_native_password' authentication plugin
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER '${PRISMA_USER_NAME}'@'%' IDENTIFIED WITH 'mysql_native_password' BY '${PRISMA_USER_PASSWORD}';"

# Grant necessary privileges to the new user
-- mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL ON mydb.* TO '${PRISMA_USER_NAME}'@'%';"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL ON *.* TO '${PRISMA_USER_NAME}'@'%';"

# Flush privileges to apply changes
mysql -u root -p ${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"
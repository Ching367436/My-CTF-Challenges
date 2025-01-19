FROM php:8.2.25-apache

# install idn_to_ascii
RUN apt-get update && apt-get install -y zlib1g-dev libicu-dev
RUN docker-php-ext-configure intl
RUN docker-php-ext-install intl

# move index.php to /var/www/html
COPY index.php /var/www/html/index.php

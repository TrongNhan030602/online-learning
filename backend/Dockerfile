FROM php:8.2-fpm

# Cài đặt dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Thiết lập thư mục làm việc
WORKDIR /var/www

# Copy project
COPY . /var/www

# Cài đặt thư viện Laravel
RUN composer install --no-dev --optimize-autoloader

# Cấp quyền cho storage
RUN chmod -R 777 /var/www/storage /var/www/bootstrap/cache

# Chạy Laravel bằng Artisan
CMD php artisan serve --host=0.0.0.0 --port=8000

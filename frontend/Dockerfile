FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port và chạy React App
EXPOSE 3000
CMD ["npm", "run", "dev"]


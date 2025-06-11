# Gunakan image Node.js versi LTS
FROM node:18

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code ke dalam container
COPY . .

# Expose port backend (ganti jika port backend kamu berbeda)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
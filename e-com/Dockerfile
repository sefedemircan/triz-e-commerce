# Node.js base image'ını kullan
FROM node:20-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Uygulamayı build et
RUN npm run build

# Portu aç
EXPOSE 5173

# Uygulamayı başlat
CMD ["npm", "run", "dev"] 
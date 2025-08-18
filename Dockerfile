# Dockerfile para Parking API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Variables de entorno para producción
ENV NODE_ENV=production

# Expone el puerto de NestJS
EXPOSE 3000

CMD ["npm", "run", "start:prod"]

FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY views ./views
COPY app.js /app/

RUN npm install

EXPOSE 8000

CMD ["node", "app.js"]
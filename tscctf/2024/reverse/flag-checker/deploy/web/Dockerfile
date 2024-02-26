FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY static ./static
COPY private ./private
COPY app.js /app/

CMD ["node", "app"]
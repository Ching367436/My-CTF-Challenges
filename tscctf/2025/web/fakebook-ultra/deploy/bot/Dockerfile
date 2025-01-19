FROM node:20-alpine

COPY src/package.json /app/
COPY src/package-lock.json /app/
WORKDIR /app

RUN apk update && apk upgrade
RUN apk add chromium 
RUN npm i
COPY src /app

CMD ["node", "app"]
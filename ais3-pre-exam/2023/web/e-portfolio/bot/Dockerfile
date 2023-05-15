FROM node:20-alpine

COPY src /app
WORKDIR /app

RUN npm i
RUN apk update && apk upgrade
RUN apk add chromium 

CMD ["node", "app"]
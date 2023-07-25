FROM node:20-alpine

COPY . /app

WORKDIR /app

COPY package*.json .

RUN npm ci
RUN npm run build 

CMD ["node", "dist/server.js"]


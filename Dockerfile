FROM node:buster

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


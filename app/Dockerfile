FROM node:14.15.3-alpine

WORKDIR /usr/src/app

RUN npm install -g typescript \
    && npm install -g concurrently

COPY package.json ./
RUN npm i

COPY ./ ./

EXPOSE 8080

CMD npm start
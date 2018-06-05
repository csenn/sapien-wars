FROM node:9.11.1

RUN mkdir -p /app

WORKDIR /app

ADD package.json .
ADD package-lock.json .
RUN npm install

ADD webpack.config.js .
ADD client client/
ADD public public/
RUN npm run client:build

ADD server server/

CMD ["npm", "run", "server:prod"]

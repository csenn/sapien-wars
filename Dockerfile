FROM node:18-alpine

RUN mkdir -p /app

WORKDIR /app

ADD package.json .
ADD package-lock.json .
RUN npm install

ADD webpack.config.js .
ADD client client/
ADD public public/
ADD scripts scripts/
RUN npm run build

CMD ["npx", "serve", "-s", "build"]

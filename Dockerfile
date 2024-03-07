FROM node:18.17.1-alpine3.18

RUN apk update && apk add --no-cache git
RUN rm -rf /tmp/* /var/cache/apk/*

RUN npm config set registry http://registry.npmjs.org && npm cache clean --force
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --unsafe-perm && npm cache clean --force
COPY . /usr/src/app
RUN rm -rf .env && cp .env.defaults .env

CMD ["npm", "start"]

FROM node:lts-hydrogen

WORKDIR /usr/app

COPY package.json /usr/app

RUN npm install

COPY . .

CMD ["node", "server.js"]

FROM node:lts-hydrogen as node

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

FROM nginx:1.25-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /usr/src/app/dist/frontend /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

FROM node:lts-hydrogen as node

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --legacy-peer-deps
COPY . .

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /usr/src/app/dist/frontend /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

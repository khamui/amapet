# Stage 1: Build Angular SSR app
FROM node:20-slim AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the source code and build
COPY . .
RUN npm run build

# Stage 2: Run Node.js SSR server
FROM node:20-alpine
WORKDIR /app

# Copy built files
COPY --from=build /app/dist/frontend/browser ./browser
COPY --from=build /app/dist/frontend/server ./server

EXPOSE 4000
CMD ["node", "server/server.mjs"]

FROM node:20-alpine
WORKDIR /app

# Copy package files and install all dependencies (including dev for build)
COPY package*.json ./
RUN npm ci

# Copy backend source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies for smaller image
RUN npm prune --production

# Expose backend port
EXPOSE 3000

# Start backend
CMD ["npm", "start"]


FROM node:20-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start backend
CMD ["npm", "start"]


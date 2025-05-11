FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose the port
EXPOSE 5000

# Start the app with proper signal handling for graceful shutdown
CMD ["node", "start.js"]
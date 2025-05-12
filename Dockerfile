FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install dependencies
# Use 'npm ci' for cleaner installs in production
RUN npm ci

# Copy app source
COPY . .

# Set default environment variables
ENV NODE_ENV=production \
    PORT=5000

# Create content directories if they don't exist
RUN mkdir -p /app/public/content/research \
    /app/public/content/pitch_materials \
    /app/public/content/announcements \
    /app/public/uploads

# Expose the port
EXPOSE 5000

# Start the app with proper signal handling for graceful shutdown
CMD ["node", "start.js"]
# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Set permissions (optional, only needed if you have permission issues)
# RUN chown -R node:node /app

# Switch to non-root user
USER node

# Increase Node.js memory limit to 2GB for npm install
ENV NODE_OPTIONS=--max-old-space-size=2048

# Install dependencies using npm ci for CI/CD reliability
RUN npm ci

# Copy the rest of the app code (ensure correct ownership)
COPY --chown=node:node . .

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

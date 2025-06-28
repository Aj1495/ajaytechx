# Use official Node.js alpine image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Create node_modules directory and set ownership
RUN mkdir -p /app/node_modules && chown -R node:node /app

# Switch to non-root user
USER node

# Increase Node.js memory limit to 128MB for npm install
ENV NODE_OPTIONS=--max-old-space-size=128

# Limit npm parallelism to 1 job
ENV npm_config_jobs=1

# Install dependencies using npm install (less memory intensive than npm ci)
RUN npm install

# Copy the rest of the app code (ensure correct ownership)
COPY --chown=node:node . .

# Debug: Search for /node-app in all files in the image
RUN find . -type f -exec grep -H "/node-app" {} \; || echo "No /node-app found"

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

# Use official Node.js slim image as base
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Set permissions (optional, only needed if you have permission issues)
# RUN chown -R node:node /app

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

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]]

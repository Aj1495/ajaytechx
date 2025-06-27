# Use official Node.js slim image as base
FROM node:18-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Switch to non-root user
USER node

# Increase Node.js memory limit to 128MB for npm install
ENV NODE_OPTIONS=--max-old-space-size=128

# Limit npm parallelism to 1 job
ENV npm_config_jobs=1

# Install dependencies using npm install
RUN npm install

# Production stage
FROM node:18-slim

WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Copy the rest of the app code
COPY --chown=node:node . .

# Switch to non-root user
USER node

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]]]

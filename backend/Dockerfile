# Use official Node.js slim image as base
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Switch to non-root user
USER node

# Increase Node.js memory limit to 128MB for npm install
ENV NODE_OPTIONS=--max-old-space-size=128

# Install yarn globally
RUN npm install -g yarn

# Install dependencies using yarn (often more memory efficient)
RUN yarn install --frozen-lockfile

# Copy the rest of the app code (ensure correct ownership)
COPY --chown=node:node . .

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]]

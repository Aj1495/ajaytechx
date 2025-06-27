# Use official Node.js image as base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Increase Node.js memory limit to 2GB for npm install
ENV NODE_OPTIONS=--max-old-space-size=2048

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

# Use the official Node.js 18 image based on Alpine Linux
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the package files first
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of your application files into the container
COPY . .

# Open port 3000 on the container to allow outside access
EXPOSE 3004

# Define the command to run your app
CMD ["node", "src/server.js"]

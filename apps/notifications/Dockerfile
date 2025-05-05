# Use an official Node.js runtime as a parent image
FROM node:20-alpine

ARG BUILD_ENV

ENV NODE_ENV=$BUILD_ENV

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies
# RUN npm install
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

# RUN npm run build

EXPOSE 4000

# Set the command to start the server using the $PORT environment variable
CMD ["sh", "-c", "npm run start"]

# CMD ["npm", "run", "start"]

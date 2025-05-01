# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

EXPOSE 3100

# Set the command to start the server using the $PORT environment variable
CMD ["npm", "start"]

# time DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64,linux/arm64 -t 574309367192.dkr.ecr.us-west-2.amazonaws.com/rfng-backend -f Dockerfile . --push
# time DOCKER_BUILDKIT=1 docker buildx build --platform linux/amd64,linux/arm64 -t 574309367192.dkr.ecr.us-west-2.amazonaws.com/rfng-backend-build -f Dockerfile . --push

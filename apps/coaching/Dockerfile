# Build Image
FROM node:20-alpine AS build

ARG BUILD_ENV
ENV NODE_ENV=$BUILD_ENV

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code and build the application
COPY . .

RUN if [ ${NODE_ENV} == "production" ]; \
    then npm run build; \
    elif [ ${NODE_ENV} == "staging" ]; \
    then npm run build:staging; \
    elif [ ${NODE_ENV} == "beta" ]; \
    then npm run build:beta; \
    else echo "Invalid NODE_ENV value"; exit 1; \
    fi

# Run Image
FROM node:20-alpine

# Set build environment during runtime
ARG BUILD_ENV
ENV NODE_ENV=$BUILD_ENV

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the built output from the build stage
COPY --from=build /app/dist ./dist

# Copy the generated Prisma Client library
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy only the .env we need for the current environment
COPY --from=build /app/.env.${BUILD_ENV} /app/.env.${BUILD_ENV}

EXPOSE 5000

# Run the application
CMD ["sh", "-c", "until nc -z -w 2 mysql-primary 3306; do >&2 echo 'MySQL is unavailable - sleeping'; sleep 10; done; npm run start"]
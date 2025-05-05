# Build Image
FROM node:20-alpine AS build

ARG BUILD_ENV=production
ENV NODE_ENV=$BUILD_ENV

WORKDIR /app

COPY package*.json ./

# Don't run scripts during build to avoid running prisma command in postinstall script
RUN npm ci --ignore-scripts

COPY . .

RUN npm run build:icons

# Select the correct .env file based on the build environment
RUN echo "Selecting environment configuration for $NODE_ENV" && \
    if [ -f ".env.${BUILD_ENV}" ]; then \
      cp ".env.${BUILD_ENV}" .env; \
    else \
      echo "Warning: .env.${BUILD_ENV} not found. Creating empty .env file."; \
      touch .env; \
    fi

# Build the Next.js application
RUN echo "Building application for $NODE_ENV environment..." && \
    npm run build

# Prune dev dependencies after build
RUN npm prune --production

# Run Image
FROM node:20-alpine

WORKDIR /app

# Set runtime environment to production for optimized Next.js runtime
# For app logic, we can use APP_ENV instead for env specific logic
# This is mainly because Next.js performs optimiziations when NODE_ENV is production
ARG BUILD_ENV
ENV APP_ENV=$BUILD_ENV
ENV NODE_ENV=production

# Copy necessary files from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 5100

CMD ["npm", "start"]
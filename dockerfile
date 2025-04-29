# BUILD STAGE

# Use the official Node.js image as the base image
FROM node:23-alpine AS build

# Create a new user called docker
RUN addgroup -S docker && adduser -S docker -G docker
USER docker

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY --chown=docker:docker package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY --chown=docker:docker ./public ./public
COPY --chown=docker:docker ./src ./src
COPY --chown=docker:docker ./tsconfig.json ./

RUN mkdir build

# Build the TypeScript code
RUN npm run build

## RUN STAGE

# Use the official Node.js image as the base image
FROM node:23-alpine

# Create a new user called docker
RUN addgroup -S docker && adduser -S docker -G docker
USER docker

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./build
COPY --chown=docker:docker ./public ./public
COPY --chown=docker:docker ./src/views ./build/views

# Install the project dependencies
RUN npm install --omit=dev

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
ENTRYPOINT ["node", "build/server.js"]

# Use the official Node.js image as the base image
FROM node:20-alpine

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
COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./

RUN mkdir build

# Build the TypeScript code
RUN npm run build

# Copy views folder into build
COPY ./src/views ./build/views

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
ENTRYPOINT ["sh", "-c", "exec node build/server.js"]

# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Prisma dependencies
# RUN npm install prisma -g

# Install other dependencies if needed
# RUN npm install
RUN npx prisma migrate generate
RUN npx prisma migrate dev
RUN npm run start:dev

# Copy the rest of your application code to the container
COPY . .

# Command to run your Prisma application
# Adjust this command according to how you run your Prisma app
CMD ["prisma", "generate"]

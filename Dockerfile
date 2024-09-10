# Step 1: Use an official Node.js image as the base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install all dependencies (including dev dependencies)
RUN npm install

# Step 5: Copy the rest of the application files to the container
COPY . .

# Step 6: Build the TypeScript application
RUN npx tsc --project .

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Define the command to run the application
CMD [ "yarn", "dev" ]

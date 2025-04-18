# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy rest of app
COPY . .

# Build TypeScript
RUN npm run build

# Run app
CMD ["npm", "start"]
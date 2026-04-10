FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend code
COPY . .

# Keep the uploads persistent if we mount it
VOLUME ["/app/uploads"]

EXPOSE 5000

# Start Node server
CMD ["npm", "start"]

# --------- Stage 1: Build ---------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install dependencies separately (leverages Docker cache)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the NestJS app (TypeScript -> JavaScript)
RUN npm run build

# --------- Stage 2: Production ---------
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled code from builder
COPY --from=builder /usr/src/app/dist ./dist

# Copy migration config & migration files
COPY --from=builder /usr/src/app/src/ormconfig.ts ./src/ormconfig.ts
COPY --from=builder /usr/src/app/src/migrations ./src/migrations


# Expose port
EXPOSE 3000

# Run migrations first, then start the app
CMD ["sh", "-c", "npm run migration:run && node dist/main.js"]

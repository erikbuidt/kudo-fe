# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
# VITE_BASE_URL should be provided as a build arg if needed for production builds
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build

# Production stage: Serve with Nginx
FROM nginx:alpine

# Copy build artifacts to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom Nginx config to handle SPA routing and API proxying
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

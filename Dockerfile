# Stage 1: Base (Install dependencies)
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Development (Run dev server)
FROM base AS dev
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: Builder (Build for production)
FROM base AS builder
COPY . .
ENV NODE_ENV=production
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 4: Production (Serve static files with Nginx)
FROM nginx:alpine AS prod
COPY --from=builder /app/out /usr/share/nginx/html
# Custom Nginx config to handle client-side routing if needed, 
# but default works for simple static sites unless deep linking is required.
# For SPA routing, we might need a custom default.conf.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

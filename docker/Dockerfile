# Stage 1: Build React app
FROM node:22-bullseye AS build

WORKDIR /app

COPY .. /app

RUN npm install

RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy the React build output to NGINX html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/login || exit 1

CMD ["nginx", "-g", "daemon off;"]

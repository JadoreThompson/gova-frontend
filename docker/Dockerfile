FROM node:22-bullseye AS build

WORKDIR /app

COPY .. /app

RUN npm install

COPY ../.env  .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/login || exit 1

CMD ["nginx", "-g", "daemon off;"]

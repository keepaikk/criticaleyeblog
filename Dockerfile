# Multi-stage build: compile the Vite SPA, then serve it with nginx.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Vite bakes VITE_* variables into the bundle at build time.
# Dokploy passes Environment tab variables to docker build as arguments.
ARG VITE_ADMIN_PATH
ENV VITE_ADMIN_PATH=$VITE_ADMIN_PATH
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

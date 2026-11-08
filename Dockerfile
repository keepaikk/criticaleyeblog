# Build stage: compile Vite SPA + generate seed data
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_ADMIN_PATH
ENV VITE_ADMIN_PATH=$VITE_ADMIN_PATH
RUN npm run build

# Production stage: Node API server + static files
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY server/ ./server/
COPY --from=build /app/dist ./dist
COPY --from=build /app/server/seed-data.json ./server/seed-data.json
EXPOSE 80
ENV PORT=80
ENV NODE_ENV=production
CMD ["node", "server/index.js"]

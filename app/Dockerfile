FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY . .
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npm run generate
FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "dev"]
FROM base AS production
ARG NEXT_PUBLIC_API_MODE=demo
ENV NEXT_PUBLIC_API_MODE=$NEXT_PUBLIC_API_MODE
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build BETTER_AUTH_URL=http://localhost:3000 BETTER_AUTH_SECRET=build-only-placeholder-secret-at-least-32-characters npm run build
ENV NODE_ENV=production
RUN mkdir -p storage/private storage/uploads && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["npm", "start"]

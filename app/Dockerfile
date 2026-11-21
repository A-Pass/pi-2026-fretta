# Estágio base compartilhado
FROM node:22-trixie-slim AS base

# Alterna para root para ter permissão de instalar pacotes no sistema
USER root

# Instala o openssl sem pacotes recomendados extras e remove os caches do apt na mesma camada
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN chown node:node /app
USER node

# 1. Copia apenas arquivos de dependências e Prisma
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma/schema.prisma ./prisma/schema.prisma
COPY --chown=node:node prisma.config.ts ./prisma.config.ts

# 2. Instala dependências (fica em cache se package.json/prisma não mudarem)
RUN npm ci

COPY --chown=node:node . .

ARG APP_PORT=3000
EXPOSE $APP_PORT

# Estágio de desenvolvimento (com devDependencies, watch e debug)
FROM base AS development
ENV NODE_ENV=development
EXPOSE 9229
CMD ["npm", "run", "dev"]

# Estágio de produção (enxuto, apenas dependências de produção)
FROM base AS production
ENV NODE_ENV=production
CMD ["npm", "start"]
# Estágio base compartilhado
FROM node:22-slim AS base
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

EXPOSE 3000

# Estágio de desenvolvimento (com devDependencies, watch e debug)
FROM base AS development
ENV NODE_ENV=development
EXPOSE 9229
CMD ["npm", "run", "dev"]

# Estágio de produção (enxuto, apenas dependências de produção)
FROM base AS production
ENV NODE_ENV=production
CMD ["npm", "start"]
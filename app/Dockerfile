# Estágio base compartilhado
FROM node:22-slim AS base
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node . .
EXPOSE 3000
RUN npm ci

# Estágio de desenvolvimento (com devDependencies, watch e debug)
FROM base AS development
ENV NODE_ENV=development
EXPOSE 9229
CMD ["npm", "run", "dev"]

# Estágio de produção (enxuto, apenas dependências de produção)
FROM base AS production
ENV NODE_ENV=production
CMD ["npm", "start"]
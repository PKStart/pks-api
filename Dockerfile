FROM node:16-alpine

WORKDIR /app
COPY ./apps/api/ ./apps/api/
COPY ./libs/common/ ./libs/common/
COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./.env.prod ./.env
RUN npm ci

WORKDIR /app/apps/api
RUN npm ci
RUN npm run build

CMD ["npm", "run", "start:prod"]


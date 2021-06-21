FROM node:16-alpine

WORKDIR /app/libs/common
COPY ./libs/common/ ./
RUN npm ci
RUN npm run build

WORKDIR /app/apps/api
COPY ./apps/api/package*.json ./
RUN npm ci
#RUN npm run build

WORKDIR /app
COPY ./apps/api/ ./apps/api/
COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./.env ./
RUN npm ci

CMD ["npm", "run", "dev:api"]

# docker build -t kinpeter/start-api .
# docker run -p 8100:8100 kinpeter/start-api

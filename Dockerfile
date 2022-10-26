FROM node:18.11.0-alpine

WORKDIR /app
COPY . .
RUN npm ci

RUN npm run build

CMD ["npm", "run", "start:prod"]


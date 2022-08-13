FROM node:16.13.1-alpine

WORKDIR /app
COPY . .
RUN npm ci

ARG ARG_PK_ENV
ARG ARG_PK_DB_CONNECTION_STRING
ARG ARG_PK_EMAIL_HOST
ARG ARG_PK_EMAIL_USER
ARG ARG_PK_EMAIL_PASS
ARG ARG_PK_JWT_SECRET
ARG ARG_PK_LOGIN_CODE_EXPIRY
ARG ARG_PK_TOKEN_EXPIRY
ARG ARG_PK_NOTIFICATION_EMAIL

ENV PK_ENV=$ARG_PK_ENV
ENV PK_DB_CONNECTION_STRING=$ARG_PK_DB_CONNECTION_STRING
ENV PK_EMAIL_HOST=$ARG_PK_EMAIL_HOST
ENV PK_EMAIL_USER=$ARG_PK_EMAIL_USER
ENV PK_EMAIL_PASS=$ARG_PK_EMAIL_PASS
ENV PK_JWT_SECRET=$ARG_PK_JWT_SECRET
ENV PK_LOGIN_CODE_EXPIRY=$ARG_PK_LOGIN_CODE_EXPIRY
ENV PK_TOKEN_EXPIRY=$ARG_PK_TOKEN_EXPIRY
ENV PK_NOTIFICATION_EMAIL=$ARG_PK_NOTIFICATION_EMAIL

RUN npm run build

CMD ["npm", "run", "start:prod"]


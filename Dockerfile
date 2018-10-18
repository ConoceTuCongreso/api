FROM node:8.12-alpine

RUN apk add --no-cache ca-certificates

RUN set -eux;                                   \
    apk add --no-cache --virtual .build-deps    \
    curl                                        \
    g++                                         \
    make                                        \
    openssl                                     \
    python                                      

WORKDIR /api

COPY src         /api/src
ADD package.json    /api
ADD yarn.lock       /api

RUN yarn install --ignore-engines

CMD [ "yarn", "start" ]

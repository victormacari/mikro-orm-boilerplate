ARG NODE_VERSION=20.16.0
ARG NODE_VARIANT=-alpine

FROM node:${NODE_VERSION}${NODE_VARIANT} as base

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --log-level=error


FROM node:${NODE_VERSION}${NODE_VARIANT} as mikro-orm-job

WORKDIR /app

COPY ./migrations ./migrations
COPY ./tsconfig.migration.json ./tsconfig.json
COPY ./src/mikro-orm-migration.config.ts mikro-orm.config.ts

COPY ./package.json host-package.json

RUN apk update && apk add jq && \
    npm init -y && \
     jq '.dependencies, .devDependencies | with_entries(select(.key | test("^@mikro-orm/(core|postgresql|cli|migrations)"))) | to_entries[] | "\(.key)@\(.value)"' host-package.json | xargs npm i && \
    jq '.devDependencies | with_entries(select(.key | test("^typescript"))) | to_entries[] | "\(.key)@\(.value)"' host-package.json | xargs npm i --save-dev && \
    npx tsc -p ./tsconfig.json && \
    npm prune --production

CMD npx mikro-orm migration:up


FROM node:${NODE_VERSION}${NODE_VARIANT} as build

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY . . 

RUN npm run build
RUN npm prune --production


FROM node:${NODE_VERSION}${NODE_VARIANT} 

WORKDIR /app

ENV PORT=3002

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN adduser vmacari --disabled-password -h /app --u 2000 && chown -R vmacari:vmacari /app

USER vmacari

CMD [ "node", "./dist/src/main.js" ]
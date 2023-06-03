FROM node:18-alpine as build

WORKDIR /usr/app

RUN corepack enable && corepack prepare pnpm@7.30.5 --activate

COPY . .

RUN pnpm i

FROM node:18-alpine

WORKDIR /usr/app

RUN corepack enable && corepack prepare pnpm@7.30.5 --activate

COPY --from=build /usr/app ./

EXPOSE 9093

CMD [ "pnpm", "start" ]
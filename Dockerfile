FROM node:18 AS install_package

WORKDIR /timer_app

COPY package.json /timer_app
COPY package-lock.json /timer_app

RUN npm install

COPY config-overrides.js /timer_app

EXPOSE 80

CMD [ "npm", "start" ]

FROM install_package AS builder

COPY ./src /timer_app/src
COPY ./public /timer_app/public

RUN npm run build

FROM nginx AS deploy

COPY --from=builder /timer_app/build /usr/share/nginx/html/stopwatch
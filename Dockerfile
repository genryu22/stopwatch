FROM node:18

WORKDIR /timer_app

COPY package.json /timer_app
COPY package-lock.json /timer_app

RUN npm install

CMD [ "npm", "start" ]
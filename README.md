This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

https://genryu22.github.io/stopwatch/

## 開発

`docker-compose up -d --build`

Runs the app in the development mode.<br>
Open http://localhost:3000/stopwatch to view it in the browser.


## デプロイ

### docker-compose.yml
```
version: '3'
services:
  react-scripts:
    build:
      context: '.'
      # target: deploy
      target: install_package
    ports:
      - 3000:3000
    volumes:
      - ./src:/timer_app/src
      - ./public:/timer_app/public
```

デプロイ時はビルドターゲットを deploy にする。
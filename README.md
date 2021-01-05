# SAMPLEPCB MARKET API

## Installation

```bash
## Dev Mode Start

# 1. npm 설치
$ yarn install

# 2. .env file 생성 및 작성
$ cp .env.example .env.dev

# 3. .env.dev 내용 입력 후 docker-compose 실행
$ docker-compose --env-file=.env.dev up -d

# 4. Dev mode 실행
$ yarn start:dev
```

## Running the app

```bash
# development
$ yarn start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

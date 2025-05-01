# README

### What is this repository for?

- Repository to hold RFNG application for RapidFunnel.<br><br>

## How to set up the application locally using docker?

Follow the instructions to set up the application locally using docker.

### Prepare a local legacy system

- Clone repository:
  ```shell
  git clone git@bitbucket.org:rapidfunnel/docker.git
  ```
- Make sure that your docker is running.
- Open cloned docker folder and run inside: `sh setup.sh`. At the end you need to see a message like `Docker set up completed successfully`.
- Make sure to run the db migration on laravel container. You can choose the no 6 option in `setup.sh` or can try the below command `docker-compose start rflaravelapi && docker-compose exec rflaravelapi php ./var/www/html/artisan migrate`

### Prepare local RFNG system

- Pull your branch with all available Docker configurations.
- Run `npm install` on respective backend and frontend apps.
- Read `README.md` instructions in `backend` and `frontend` folders, some preparations can be required there (.env files).
- Run below command on terminal to up the applications.
  ```shell
  docker compose --env-file .env.docker.local -f docker-compose.local.yaml up -d
  ```
- Hint: docker uses `.env.docker.local` as a configuration at the previous step; check your local things to be sure. There is a legacyplatform `linux/amd64` for x64 as default; this value can be replaced with `linux/arm64/v8` for M1.

### Connect legacy and RFNG container networks:

Connect RFNG and legacy system in docker:

```shell
docker network connect docker_rfnet rfng-backend
```

You can check whether it's required to do the step

```shell
docker network inspect docker_rfnet
```

Container with name `rfng-backend` must be present).
Probably, at the end of this step the restart is required

```shell
docker container restart rfng-backend
```

## Configuration for the application

The local Docker environment will have the following configurations.

- APP_ENV should be either **local / staging / production**
- Port Mapping<br>

  | Services    | Host Port | Container/Image Port |
  | ----------- | :-------: | :------------------: |
  | API gateway |   4000    |         4000         |
  | Backend     |   3100    |         3100         |
  | Frontend    |   3000    |         3000         |
  | MySQL       |   3307    |         3307         |
  | Mongo       |   27018   |        27018         |

  *Container/Image Port - It should be exposed by the docker image/container<br>
  *Host Port - A port on the host to which the service is bind to. i.e localhost:3000

- **MongoDB Credentials :**<br>
  MONGO_HOST: rfng-mongodb-service<br>
  MONGO_DATABASE: devrfng<br>
  MONGO_USER: user<br>
  MONGO_PASSWORD: password<br>

- **MySQL DB Credentials :**<br>
  MySQL_HOST : rfng-mysql-service<br>
  MYSQL_ROOT_PASSWORD: root<br>
  MYSQL_DATABASE: devrfng<br>
  MYSQL_USER: user<br>
  MYSQL_PASSWORD: password<br>

## Contribution guidelines

- Writing tests
- Code review
- Other guidelines

## Who do I talk to?

- Repo owner or admin
- Other community or team contact

## Code formatting

We use `prettierrc` as a config file for source code. You can use it in VSCode wit prettier plugin to auto-format source code.

## Logging

Client application (mobile or front-web) sends logs to backend and to Mixpanel. They both should have the same, but in different representation.

### File logging

If we use local environment (see `API_HOST` variable or way of start-up) the logs will be collected at backend side (`backend/logs`). The same happens if we use demo or any oanother env - look to backend server which app communicated to and you can found the logs there by the same path.

### Mixpanel

Visit https://mixpanel.com/ and login with google sso account from Rapidfunnel. It can suggest to join to Rapidfunnel at start, that's ok. And next, you can see app live events.

## Testing

### Frontend

You can start cypress on frontend directory via `npm run cypress:open` or `npx cypress open`. After cypress starting, open its window and run `E2E Testing` manually from the list.

### Backend

You can start cypress on backend directory via `npm run cypress:open` or `npx cypress open`. After cypress starting, open its window and run `E2E Testing` manually from the list.

## DuploCloud

Bash scripts from the `kubetools` can help in interactions with containers on the staging and production environment.

### Requirements

1. [kubectl](https://kubernetes.io/docs/reference/kubectl/)
2. [duplo-jit](https://github.com/duplocloud/duplo-jit)
3. kubectl config
   - DuploCloud -> select necessary tenant -> Kubernetes -> Services -> KubeCtl button -> KubeConfig -> Download Kube Config;
   - add this config to the default kubectl config in your system (for nix systems: _~/.kube/config_)
   - if you get error about wrong config, add to the config bottom next lines:
   ```text
   kind: Config
   preferences: {}
   ```

### Usage:

```shell
kubetools [env] [command]
```

Where:

- env: _stage_ or _prod_
- command:
  - _list_: show all available resources
  - _shell_: connects to the rfng-backend shell
  - _logFiles_: copy rfng-backend logs to the current folder
  - _logMonitor_: follow the rfng-backend logs
  - _help_: show help

## Analytics

### Device Stats

We can generate reports about device stats based on logs, e.g.:

```shell
node ./backend/analytics/deviceInfoStats.js --file 2024-07-30.jsonl --only-report
```

Where:

- _file_ - filename with all logs on backend;
- _only-report_ - the script outputs only report as json;

Run without params will show an error and detailed way of usage, e.g.:

```shell
% node ./backend/analytics/deviceInfoStats.js
Error: 'file' parameter is mandatory.

Usage:
 node ./backend/analytics/deviceInfoStats.js --file logfilename [--start startDate] [--finish finishDate]
Params:
        [--file logfilename] filename with logs to parse, jsonl-format
        --start [startDate] start date for filtering (no records before the date).
        --fiinsh [finishDate] finish date for filtering (no records before the date).
        --only-report no extra information in the result, only report json or error message.
        Date formats are acceptable as Y-M-D; other formats are on your risk (milliseconds unix time should be accepted).
```

Additional details can be found in [Confluence](https://rapidfunnel.atlassian.net/wiki/spaces/EH/pages/657653765/Device+stats+analysis).

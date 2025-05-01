# Getting Started with Backend API

## Quick local launch

Make a copy of `.env.local` file into `.env.development` file.

## Configuration and launch in detail

Currently, It is connected to mongo db server. Please provide the mongo DB server details in the env file. Please check the config/config file to know the KEY names

Kindly create an environmental file and name it as `.env.local`. In this new file, please assign your MongoDB URL appropriately and change the `dbName` to match your specific database name.

`MONGO_URL = mongodb://localhost:27017/dbName`

Please specify the PORT number in the .env.file where you want to run your API server. For example:

```dotenv
SERVER_PORT = 9090
```

Please specify the default database provided as mongo.

```
DB_PROVIDER = 'mongo'

```

Please add the mongo username, password and database name in case you're trying to connect to mongo atlas. Please update the mongo url accordingly

```
MONGO_USERNAME = user-name
MONGO_PASSWORD = password
MONGO_DB = db_name

```

## Available Scripts

Please create a env file and provide the required value. Then install the dependency using the following command

### `npm install`

Please provide the port number as per your env file. If the port number is 5000 Then , you can run the following command:

### `npm start`

Open [http://localhost:3100/ping](http://localhost:5000/ping) to view it in your browser/postman.

You can also see the example API endpoint here [http://localhost:3100/api/example](http://localhost:5000/api/example) to view it in your Postman.

Please use the following command to run the unit test

### `npm test`

**Backend Folder Structure**

- config: Contains env. variables
- controllers: Handles requests and sends response
- services: Contains business logic, database operations
- exceptions
- db
  - mongo
    - models
    - helpers
  - mysql
    - models
    - helpers
- driver
- dto
- library
- middlewares
- routes
  - v1
  - v2
- utils

- [ ] File containing classes will start with capital letters. (EventItem, Contacts, etc...)
- [ ] File not containing any class will follow camelCase format.

### `npm run cypress:open`

After initiating Cypress, open its window, and manually execute the `E2E Testing` from the list for testing. Then, choose any tests for checking.

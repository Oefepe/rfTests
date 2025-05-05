# Getting Started with frontend app

## Quick local launch

Make a copy of `.env.example` file into `.env.development` file. Uncomment lines with variables.

## Configuration and launch in detail

Please create a local env file named as `.env.development` and add the following lines and update your API url

```dotenv
VITE_API=http://localhost:4000/
LUMEN_API_URL=http://localhost:8093/
VITE_LEGACY_WEB=http://localhost:8090
```

## Available Scripts

In the project directory, you can run:

### `npm install`

Ensure there is no folder named node_modules within the frontend directory prior to executing the above command.

then to start with the following command

### `npm start`

If you find and lint issue, please check it using the below command

### `npm run lint`

Run the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

There is a change that you might get an error if you open the backend and frontend code base in the VS code. In that case, please update the eslint.json file with the below option

`"project": "./tsconfig.json"`

Please change this to something

```
"tsconfigRootDir": "./frontend",
"project": "tsconfig.json"
```

### `npm run cypress:open`

After initiating Cypress, open its window, and manually execute the `E2E Testing` from the list for testing. Then, choose any tests for checking.

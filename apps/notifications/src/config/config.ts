import joi from 'joi';

const envVarsSchema = joi
  .object({
    SERVER_PORT: joi.number().required().default(4000),
    LARAVEL_URL: joi.string().required(),
    TIMEOUT: joi.number().default(50000),
  })
  .unknown()
  .required();

const { error, value } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const LARAVEL_URL = value.LARAVEL_URL;

const SERVER_PORT = value.SERVER_PORT;

const config = {
  server: {
    port: SERVER_PORT,
  },
  laravelUrl: LARAVEL_URL,
  timeout: value.TIMEOUT,
};

export default config;

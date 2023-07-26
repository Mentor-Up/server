import dotenv from "dotenv";

dotenv.config();

const {
  NODE_ENV,
  DATABASE,
  DATABASE_PASSWORD,
  PORT,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION,
} = process.env;

const requiredValues = [
  "DATABASE",
  "DATABASE_PASSWORD",
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRATION",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRATION",
];

for (const value of requiredValues) {
  if (!process.env[value]) {
    console.error(`${value} is required in the .env file`);
    process.exit(1);
  }
}

export {
  NODE_ENV as node_env,
  DATABASE as database,
  DATABASE_PASSWORD as database_password,
  PORT as port,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION,
};

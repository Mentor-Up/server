import dotenv from 'dotenv'
import assert from 'assert'

dotenv.config();

const {
    NODE_ENV,
    DATABASE,
    DATABASE_PASSWORD,
    PORT,
} = process.env

assert(DATABASE, "DATABASE is required")
assert(DATABASE_PASSWORD, "DATABASE_PASSWORD is required")


export {
    NODE_ENV as node_env,
    DATABASE as database,
    DATABASE_PASSWORD as database_password,
    PORT as port, 
};
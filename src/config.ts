import dotenv from 'dotenv'
import assert from 'assert'

dotenv.config();

const {
    DATABASE,
    DATABASE_PASSWORD,
    PORT,
} = process.env

assert(DATABASE, "DATABASE is required")
assert(DATABASE_PASSWORD, "DATABASE_PASSWORD is required")
assert(PORT, "PORT is required")


export {
    DATABASE as database,
    DATABASE_PASSWORD as database_password,
    PORT as port
};
import dotenv from 'dotenv'
import assert from 'assert'

dotenv.config();

const {
    NODE_ENV,
    DATABASE,
    DATABASE_PASSWORD,
    PORT_CONFIG,
    CLIENT_URL,
} = process.env

assert(DATABASE, "DATABASE is required")
assert(DATABASE_PASSWORD, "DATABASE_PASSWORD is required")


export {
    NODE_ENV ,
    DATABASE,
    DATABASE_PASSWORD ,
    PORT_CONFIG, 
    CLIENT_URL, 
};
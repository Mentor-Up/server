import mongoose from 'mongoose';
import { node_env, database, database_password, port } from './config';
import app from './app';

const DB = database?.replace('<password>', `${database_password}`);

mongoose.set('strictQuery', true);

const PORT = port || 8000;

const listener = async () => {
  if (!DB) {
    console.log('A connection string is required to connect to the DB');
    return;
  }
  try {
    await mongoose.connect(DB);
    const server = app.listen(port, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

listener();

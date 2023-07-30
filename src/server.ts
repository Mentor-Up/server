import mongoose from 'mongoose';
import { 
  NODE_ENV ,
  DATABASE,
  DATABASE_PASSWORD ,
  PORT_CONFIG,  
} 
    from './config';
import app from './app';


const DB = DATABASE?.replace(
    "<password>",
    `${DATABASE_PASSWORD}`
  );
  
mongoose.set("strictQuery", true);

const PORT = PORT_CONFIG || 8000;

const listener = async () => {
  if (!DB) {
    console.log("A connection string is required to connect to the DB");
    return;
  }
  try {
    await mongoose.connect(DB);
    const server = app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

listener();



  
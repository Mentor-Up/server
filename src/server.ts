const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app.ts");


dotenv.config({ path: "./config.env" });

const DB = process?.env?.DATABASE?.replace(
    "<password>",
    `${process.env.DATABASE_PASSWORD}`
  );
  
  mongoose.set("strictQuery", true);
  
  const listener = async () => {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connect successfully"))
    console.log(`Listening to port ${8000}`);
    
  };
  const { PORT = 8000 } = process.env;
  const server = app.listen(PORT, listener);


  
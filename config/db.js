// const mongoose = require("mongoose")
// require("dotenv").config()

// const MONGO_DB_CONNECTION_URL = process.env.MONGO_DB_CONNECTION_URL

// function connectToMongoDB(){
//     mongoose.connect(MONGO_DB_CONNECTION_URL, 
//     {
//         bufferCommands: false, // Disable command buffering
//         connectTimeoutMS: 150000, 
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })

//     mongoose.connection.on("connected", ()=>{
//         console.log("Connected to MongoDB")
        

//     })
//     mongoose.connection.on("error", (err)=>{
//         console.log(err)
//         console.log("An error has occured")
//     })
// }

// module.exports = {connectToMongoDB}


const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_DB_CONNECTION_URL = process.env.MONGO_DB_CONNECTION_URL;

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_DB_CONNECTION_URL);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = { connectToMongoDB };

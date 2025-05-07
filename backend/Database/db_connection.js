import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const URL = process.env.MONGODB_API_KEY;
if (!URL) {
    throw new Error("Please define the MONGODB_API_KEY");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Error connecting to database: ", error);
        process.emit(1);
    }
}

export default connectToDatabase;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://jeremynicholas897:Cookiem@ster2005@jeremy.w4kohol.mongodb.net/?retryWrites=true&w=majority&appName=Jeremy";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
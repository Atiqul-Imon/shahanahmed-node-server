import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


if(!process.env.DB_URI){
    throw new Error("Mongodb URI is not provided");
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Mongodb Connected");
        
    } catch (error) {
        console.log("Mongodb connection error", error);
        process.exit(1);         
        
    }
}

export default connectDB;
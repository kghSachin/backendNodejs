import mongoose from 'mongoose';
import "dotenv/config"
import { DB_NAME } from '../constants.js';


const connectDB = async ()=>{
    try{
        console.log("MONGODB_URI",process.env.MONGODB_URI);
    const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`MongoDB connected to ${connectionInstance.connection.host}`)
    }catch(error){
     console.log("Connection error with database ",error);
     process.exit(1);
    }
}
export default connectDB;
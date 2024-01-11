import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
//for configuring cors
//app.use is used to add middleware to your express application or to do configurations 
app.use(cors(
   {
    origin : process.env.CORS_ORIGIN,
    credentials: true,
   }
));
app.use(express.json({limit : "16kb"}));
//for url encoded data 
app.use(express.urlencoded({extended: true, limit: "16kb"}));
//for static files in your project 
app.use(express.static("public"));
// access user cookies from the server and helps to perform CRUD operations on cookies
app.use(cookieParser());
export {app}



//Routes 
import userRouter from "./routes/user.routes.js"

//routes declaration 
app.use("/api/v1/users",userRouter)

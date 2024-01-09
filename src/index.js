import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import { DB_NAME } from './constants.js';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: './env'
});

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server is running on port: ${process.env.PORT || 8000}`)
    })
    app.on('error', (error)=>{
        console.log(`Error on app.on error index.js: ${error}`)
    })
}).catch((error)=>{
console.log(`MONGODB CONNECTION ERROR: ${error}`)
});
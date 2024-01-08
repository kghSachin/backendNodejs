import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import { DB_NAME } from './constants.js';
import connectDB from './db/index.js';

dotenv.config({
    path: './env'
});

connectDB();
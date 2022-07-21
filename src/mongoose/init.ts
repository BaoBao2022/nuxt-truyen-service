import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const mongodbUri = process.env.MONGODB_URI as string;
export async function connectDB() {
    try {
        await mongoose.connect(mongodbUri);
    } catch (err) {
        console.error(err);
    }
}
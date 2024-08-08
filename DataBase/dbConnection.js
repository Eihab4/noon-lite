import mongoose from 'mongoose'; // Ensure 'mongoose' is imported
import dotenv from 'dotenv';

dotenv.config(); 

const dbUri = process.env.DATABASE_URL;
export const dbConnection=mongoose.connect(dbUri)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));
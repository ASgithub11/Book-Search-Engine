import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database Connected.')
        return mongoose.connection;
    } catch (error){
        console.error('Database Connection Error:', error);
        throw new Error('Database connection Failed.');
    }
};

export default db;

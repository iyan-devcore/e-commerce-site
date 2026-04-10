import dotenv from 'dotenv';
import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/iyan";
mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

export default db;
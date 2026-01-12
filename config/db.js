const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lerning';
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://yadavhemant9719_db_user:Hemant$9719@cluster0.nt0ymv8.mongodb.net/?appName=Cluster0/lerning';
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(mongoURI);
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`✗ MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;


const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the same directory
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        console.log(`Connecting to: ${uri.replace(/:([^@]+)@/, ':****@')}`); // Log masked URI
        await mongoose.connect(uri);
        console.log('MongoDB connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();

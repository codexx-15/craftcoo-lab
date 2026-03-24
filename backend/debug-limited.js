const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const debugLimitedEdition = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Count all products
        const total = await Product.countDocuments();
        console.log(`Total products in database: ${total}`);

        // 2. Find products where isLimitedEdition is true
        const limited = await Product.find({ isLimitedEdition: true });
        console.log(`Products marked as Limited Edition (${limited.length}):`);
        limited.forEach(p => {
            console.log(`- ID: ${p._id}, Name: ${p.name}, Price: ${p.price}`);
        });

        // 3. Find products where isLimitedEdition is false or missing
        const regular = await Product.find({ isLimitedEdition: { $ne: true } });
        console.log(`Regular products (not Limited Edition): ${regular.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error debugging products:', error);
        process.exit(1);
    }
};

debugLimitedEdition();

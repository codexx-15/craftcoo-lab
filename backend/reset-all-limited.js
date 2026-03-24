const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const resetAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Reset all products to NOT be limited edition
        const result = await Product.updateMany({}, { isLimitedEdition: false });
        console.log(`\nSUCCESS: Reset ${result.modifiedCount} products.`);
        console.log('All products are now "Regular" items.');
        console.log('\nACTION REQUIRED: Please go to your Admin Panel and check the "Limited Edition" box for ONLY the 2 products you want.');
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAll();

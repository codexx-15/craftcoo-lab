const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const resetLimitedEdition = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Reset all products to NOT be limited edition
        const result = await Product.updateMany({}, { isLimitedEdition: false });
        console.log(`Success: Reset ${result.modifiedCount} products. All products are now regular products.`);
        console.log('You can now go to the Admin Panel and mark exactly ONE product as Limited Edition.');

        process.exit(0);
    } catch (error) {
        console.error('Error resetting products:', error);
        process.exit(1);
    }
};

resetLimitedEdition();

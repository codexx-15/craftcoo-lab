const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const allProducts = await Product.find({});
        console.log(`\nFound ${allProducts.length} total products:`);
        
        allProducts.forEach(p => {
            console.log(`- ${p.name} | Price: ₹${p.price} | Limited: ${p.isLimitedEdition || false}`);
        });

        const above999 = await Product.find({ price: { $gte: 999 } });
        console.log(`\nProducts above 999 (${above999.length}):`);
        above999.forEach(p => console.log(`- ${p.name} (₹${p.price})`));

        const limited = await Product.find({ isLimitedEdition: true });
        console.log(`\nLimited Edition products (${limited.length}):`);
        limited.forEach(p => console.log(`- ${p.name}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();

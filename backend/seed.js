const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
    {
        name: 'Custom Bulb Deco',
        description: 'A beautiful custom bulb decoration for your home.',
        price: 299,
        category: 'decor',
        image: '/images/custom-bulb-deco.png',
        stock: 10
    },
    {
        name: 'Custom Wall CD Hanging',
        description: 'Unique wall hanging made from CDs.',
        price: 299,
        category: 'decor',
        image: '/images/custom-wall-cd.png',
        stock: 5
    },
    {
        name: 'Ocean on Vinyl',
        description: 'Beautiful ocean painting on a vinyl record.',
        price: 499,
        category: 'paintings',
        image: '/images/ocean-vinyl.png',
        stock: 3
    },
    {
        name: 'Custom Xmas Postcard',
        description: 'Personalized Christmas postcards.',
        price: 150,
        category: 'postcards',
        image: '/images/xmas-postcard.png',
        stock: 100
    },
    {
        name: 'Animal Canvas',
        description: 'Hand-painted animal canvas.',
        price: 599,
        category: 'paintings',
        image: '/images/animal-canvas.png',
        stock: 2
    },
    {
        name: 'Mystery Craft Hamper',
        description: 'A surprise hamper filled with craft items.',
        price: 1299,
        category: 'hampers',
        image: '/images/gift-hamper.png',
        stock: 10
    }
];

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected. Deleting existing products...');
        await Product.deleteMany();
        console.log('Inserting products...');
        await Product.insertMany(products);
        console.log('Data Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
};

seedData();

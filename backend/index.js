const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
    // Seed system products
    const Product = require('./models/Product');
    const customProduct = await Product.findOne({ name: 'Custom Painting' });
    if (!customProduct) {
        await Product.create({
            name: 'Custom Painting',
            description: 'Your custom masterpiece',
            price: 0,
            category: 'Custom',
            image: '/images/custom-paintings.png',
            stock: 999
        });
        console.log('Seed: Custom Painting product created');
    }
});

const app = express();

const path = require('path');

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:5177",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:5175",
            "http://127.0.0.1:5176",
            process.env.FRONTEND_URL
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images in development as well
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Serve static files from the frontend dist folder in production
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');
    const fs = require('fs');
    if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            if (req.originalUrl.startsWith('/api')) {
                return res.status(404).json({ message: 'API endpoint not found' });
            }
            res.sendFile(path.resolve(distPath, 'index.html'));
        });
    } else {
        app.get('/', (req, res) => {
            res.send('API is running (Production)... Front-end dist not found.');
        });
    }
} else {
    // Basic route
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

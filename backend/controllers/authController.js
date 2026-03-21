const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
exports.registerUser = async (req, res) => {
    console.log('Register request body:', req.body);
    const { name, email, password, isAdmin } = req.body;
    try {
        if (!name || !email || !password) {
            console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const isFirstUser = (await User.countDocuments({})) === 0;
        const user = await User.create({ name, email, password, isAdmin: isFirstUser || isAdmin || false });
        console.log(`User created: ${user.email}, isAdmin: ${user.isAdmin}`);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('REGISTER CONTROLLER ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

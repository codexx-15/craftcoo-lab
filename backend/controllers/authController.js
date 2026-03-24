const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Generate 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = await User.create({ 
            name, 
            email, 
            password, 
            isAdmin: isFirstUser || isAdmin || false,
            isVerified: false,
            verificationCode,
            verificationCodeExpires
        });

        // Send Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your craftco.lab account',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #D85C63; text-align: center;">Welcome to craftco.lab!</h2>
                        <p>Hi ${user.name},</p>
                        <p>Thank you for joining our community of art lovers. Please use the verification code below to activate your account:</p>
                        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 10px; margin: 20px 0;">
                            ${verificationCode}
                        </div>
                        <p style="color: #666; font-size: 12px; text-align: center;">This code will expire in 10 minutes.</p>
                        <p>If you didn't create this account, please ignore this email.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="text-align: center; color: #999; font-size: 12px;">© 2026 craftco.lab. Handcrafted with Love.</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // We still created the user, but they need to resend the code
        }

        console.log(`User created: ${user.email}, isAdmin: ${user.isAdmin}`);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            message: 'Verification code sent to email'
        });
    } catch (error) {
        console.error('REGISTER CONTROLLER ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({ 
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isVerified: true,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resend Verification Code
exports.resendCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'New Verification Code - craftco.lab',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #D85C63; text-align: center;">New Verification Code</h2>
                    <p>Hi ${user.name},</p>
                    <p>Use the verification code below to activate your account:</p>
                    <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 10px; margin: 20px 0;">
                        ${verificationCode}
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">This code will expire in 10 minutes.</p>
                </div>
            `
        });

        res.json({ message: 'Verification code resent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ 
                    message: 'Please verify your email to login',
                    isVerified: false,
                    email: user.email
                });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: true,
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

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@craftco.com';
        const userExists = await User.findOne({ email });

        if (userExists) {
            userExists.isAdmin = true;
            await userExists.save();
            console.log('Admin user updated successfully');
        } else {
            await User.create({
                name: 'Admin User',
                email: email,
                password: 'admin123', // You should change this after first login
                isAdmin: true
            });
            console.log('Admin user created successfully');
        }
        
        console.log('---------------------------------');
        console.log('Login Email: admin@craftco.com');
        console.log('Login Password: admin123');
        console.log('---------------------------------');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();

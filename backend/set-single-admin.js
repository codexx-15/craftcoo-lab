const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const setOnlyOneAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Set isAdmin to false for ALL users first
        const updateAll = await User.updateMany({}, { isAdmin: false });
        console.log(`Reset isAdmin for ${updateAll.modifiedCount} users.`);

        // 2. Set only craftcoo.lab@gmail.com as Admin
        const adminUser = await User.findOneAndUpdate(
            { email: 'craftcoo.lab@gmail.com' },
            { isAdmin: true },
            { new: true }
        );

        if (adminUser) {
            console.log('Success: craftcoo.lab@gmail.com is now the ONLY Admin.');
        } else {
            console.log('Error: User craftcoo.lab@gmail.com not found in database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating admin status:', error);
        process.exit(1);
    }
};

setOnlyOneAdmin();

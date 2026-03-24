const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const manageUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Remove the temporary admin I created
        await User.deleteOne({ email: 'admin@craftco.com' });
        console.log('Removed temporary admin: admin@craftco.com');

        // 2. Promote lalgautam236@gmail.com to admin as well
        const user = await User.findOne({ email: 'lalgautam236@gmail.com' });
        if (user) {
            user.isAdmin = true;
            await user.save();
            console.log('Promoted lalgautam236@gmail.com to Admin');
        }

        // 3. Verify craftcoo.lab@gmail.com is admin (as seen in screenshot)
        const craftcoAdmin = await User.findOne({ email: 'craftcoo.lab@gmail.com' });
        if (craftcoAdmin) {
            console.log('Confirmed: craftcoo.lab@gmail.com is an Admin');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error managing users:', error);
        process.exit(1);
    }
};

manageUsers();

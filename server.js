require('dotenv').config();
const app = require('./app.js');
const connectDB = require('./config/db.js');

const PORT = process.env.PORT || 3000;

console.log('Initializing server...');
const startServer = async () => {
    try {
        await connectDB();  // wait for MongoDB
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};
console.log('Starting server...');
startServer();

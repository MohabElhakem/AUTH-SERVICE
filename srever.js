require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database 
connectDB();

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//This file is for turnning on everything and starting the server

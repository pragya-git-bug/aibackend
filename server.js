// Load environment variables from .env file
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3000;
// `BIND_HOST` is the network interface the server binds to (use 0.0.0.0 in containers/production).
// `PUBLIC_HOST` is the external hostname used for public URLs (used for logs and docs).
const BIND_HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_HOST = process.env.SWAGGER_HOST || `${BIND_HOST}:${PORT}`;


connectDB()
    .then(() => {
        // app.listen(PORT, BIND_HOST, () => {
        //     console.log(`✓ Server is running on https://${PUBLIC_HOST}`);
        // });
    })
    .catch((error) => {
        console.error('✗ Failed to start server:', error.message);
        console.error('Please ensure MongoDB is running or set MONGODB_URI environment variable');
        process.exit(1);
    });
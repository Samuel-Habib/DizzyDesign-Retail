const express = require('express');
const path = require('path');
const cors = require('cors');
require('./config/db.config');

const app = express();

// Enable CORS for API access
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// API Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const imageRoutes = require('./routes/imageRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paypalRoutes = require('./routes/paypalRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/paypal', paypalRoutes);

// Serve static assets correctly on Vercel
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    maxAge: '1y',
    immutable: true,
}));

// Handle 404 Errors for Unknown API Routes
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

// Export for Vercel
module.exports = app;
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS middleware
require('./config/db.config');

const app = express();

// Enable CORS for API access
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// API Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const imageRoutes = require('./routes/imageRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paypalRoutes = require('./routes/paypalRoutes');

const cookieParser = require('cookie-parser');

//enable cookie parsing for login
app.use(cookieParser());

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/paypal', paypalRoutes);

app.use('/styles', express.static(path.join(__dirname, 'style'))); // Serve styles
// app.use('/images', express.static(path.join(__dirname, 'jpgs'))); // Serve images

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other routes by serving React's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Handle 404 Errors for Unknown API Routes
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

app.use(
    '/assets',
    express.static('assets', {
      maxAge: '1y', // Cache for 1 year
      immutable: true, // Assets won't change
    })
  );

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
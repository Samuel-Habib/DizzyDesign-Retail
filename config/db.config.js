const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbURI = process.env.MONGODB_URI;

// Check if there's an existing connection
let cachedConnection = global.mongoose;

if (!cachedConnection) {
    cachedConnection = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cachedConnection.conn) {
        console.log('Using cached MongoDB connection');
        return cachedConnection.conn;
    }

    if (!cachedConnection.promise) {
        console.log('Creating new MongoDB connection');
        cachedConnection.promise = mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    cachedConnection.conn = await cachedConnection.promise;
    return cachedConnection.conn;
}

mongoose.set('debug', true);

module.exports = { connectDB, dbURI };
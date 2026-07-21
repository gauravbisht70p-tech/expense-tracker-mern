const mongoose = require('mongoose');

let useInMemory = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // If no valid MongoDB URI is configured, use in-memory mode
  if (!uri || uri === 'YOUR_DATABASE_URI') {
    console.log('No MongoDB URI configured. Running in in-memory mode.'.yellow);
    console.log('Data will not persist between restarts.'.yellow);
    console.log('Set MONGO_URI in config/config.env for persistent storage.'.yellow);
    useInMemory = true;
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (err) {
    console.log(`MongoDB connection failed: ${err.message}`.red);
    console.log('Falling back to in-memory mode. Data will not persist.'.yellow);
    useInMemory = true;
  }
}

const isInMemoryMode = () => useInMemory;

module.exports = connectDB;
module.exports.isInMemoryMode = isInMemoryMode;
const mongoose = require("mongoose");

let cachedConn = null;

const connectDB = async () => {
  if (cachedConn) {
    return cachedConn;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGODB_URI not defined");
    }

    const conn = await mongoose.connect(mongoURI);
    cachedConn = conn;
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("✗ MongoDB Connection Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;

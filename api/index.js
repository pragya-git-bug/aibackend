require("dotenv").config();

const app = require("../app");
const connectDB = require("../config/db");

let isConnected = false;

async function initDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✓ MongoDB connected (Vercel)");
  }
}

module.exports = async (req, res) => {
  try {
    await initDB();
    return app(req, res);
  } catch (error) {
    console.error("✗ Vercel Handler Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

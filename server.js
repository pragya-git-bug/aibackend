// Load environment variables
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ✅ Connect DB only once (important for Vercel)
let isConnected = false;

async function initServer() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✓ MongoDB connected");
  }
}

// 🚀 Vercel Serverless Handler
module.exports = async (req, res) => {
  try {
    await initServer();
    return app(req, res);
  } catch (error) {
    console.error("✗ Server Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🖥 Local Development Server
if (NODE_ENV === "development") {
  initServer()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("✗ Startup Error:", err.message);
      process.exit(1);
    });
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

// CORS Configuration
app.use(cors({
  origin: '*', // Allow all origins (you can specify specific origins like ['http://localhost:3000', 'http://192.168.1.15:3000'])
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
const swaggerFilePath = path.join(__dirname, 'swagger-output.json');
if (fs.existsSync(swaggerFilePath)) {
  const swaggerFile = require('./swagger-output.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
} else {
  console.warn('⚠ Swagger documentation not found. Run "npm run swagger-autogen" to generate it.');
}

// Routes
/**
 * @route GET /
 * @desc Home route
 * @access Public
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// User Information Routes
const userInformationRoutes = require('./route/userInformationRoutes');
app.use('/api/users', userInformationRoutes);

// Assignment Routes
const assignmentRoutes = require('./route/assignmentRoutes');
app.use('/api/assignments', assignmentRoutes);

// Quiz Routes
const quizeRoutes = require('./route/quizeRoutes');
app.use('/api/quizes', quizeRoutes);

module.exports = app;
// app.js (Entry point)
const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const logger = require('./loggerInstance');
const loggingMiddleware = require('./middlewares/logger');
const { connectToMongoDB } = require('./config/db');

const app = express();

// Logging middleware
app.use(loggingMiddleware);


// Database connection
connectToMongoDB();

// Middleware
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  winston.error(err.message);
  res.status(500).send('Something went wrong.');
});

const server = require('http').Server(app);

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  // winston.info(`Server running on port ${port}`);
  console.log(`Server running on port ${port}`);
});

async function closeServer() {
  await server.close();
}

module.exports = {
  app,
  closeServer
};

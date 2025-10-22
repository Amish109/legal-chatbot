require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./utils/errorHandler');

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document');
const chatRoutes = require('./routes/chat');

const setupSwagger = require('../swagger.js'); // <-- import here


const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimiter);

// Static uploads (for demo)
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

// Global error handler
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    setupSwagger(app);
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

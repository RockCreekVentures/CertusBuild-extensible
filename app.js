/**
 * CertusBuild AU - App-Based Version
 * Main application file
 */

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs-extra');
const logger = require('morgan');
const multer = require('multer');

// Initialize Express app
const app = express();

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Import routes
const indexRouter = require('./routes/index');
const researchRouter = require('./routes/research');
const pitchMaterialsRouter = require('./routes/pitch_materials');

// Map routes
app.use('/', indexRouter);
app.use('/research', researchRouter);
app.use('/pitch-materials', pitchMaterialsRouter);

// Error handling
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 }
  });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).render('error', {
    title: 'Error',
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CertusBuild AU server running on port ${PORT}`);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }
});

module.exports = app;
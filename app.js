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
const session = require('express-session');
const passport = require('passport');

// Load environment variables
require('dotenv').config();

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


// Tell Express to trust the first hop of a reverse proxy
app.set('trust proxy', 1);

// Configure view engine
// ... (rest of your existing code)


// Session management
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'dev_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Check if authentication bypass is enabled, if so, skip Redis setup
if (process.env.AUTH_BYPASS_ENABLED === 'true') {
  console.log('Authentication bypass is enabled - using in-memory session storage');
} 
// Use Redis for session storage in production when authentication is required
else if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  try {
    // Simple approach with connect-redis 6.x and redis 3.x
    const RedisStore = require('connect-redis')(session);
    
    // Create a Redis client with minimal configuration
    const redis = require('redis');
    
    // Extract host and port from REDIS_URL if provided
    let redisHost = 'redis';
    let redisPort = 6379;
    
    // Simple parsing of Redis URL
    if (process.env.REDIS_URL && process.env.REDIS_URL.includes('://')) {
      const url = new URL(process.env.REDIS_URL);
      redisHost = url.hostname;
      redisPort = url.port || 6379;
    }
    
    // Create standard redis client (redis v3.x style)
    const redisClient = redis.createClient({
      host: redisHost,
      port: redisPort
    });
    
    // Basic error handling
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
    
    // Configure session store
    sessionConfig.store = new RedisStore({client: redisClient});
    console.log(`Using Redis for session storage (${redisHost}:${redisPort})`);
  } catch (error) {
    console.error('Redis session store initialization failed:', error.message);
    console.log('Falling back to in-memory session storage');
  }
} else {
  console.log('Using in-memory session storage - not recommended for production');
}

app.use(session(sessionConfig));

// Setup authentication
const { requireAuth } = require('./utils/auth-config')(app);

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
const utilitiesRouter = require('./routes/utilities');

// Middleware to ensure activeLink is always set
app.use((req, res, next) => {
  // Default activeLink to null
  res.locals.activeLink = null;
  
  // Set activeLink based on the URL path
  if (req.path === '/') {
    res.locals.activeLink = 'home';
  } else if (req.path.startsWith('/research')) {
    res.locals.activeLink = 'research';
  } else if (req.path.startsWith('/pitch-materials')) {
    res.locals.activeLink = 'pitch_materials';
  } else if (req.path.startsWith('/utilities')) {
    res.locals.activeLink = 'utilities';
  } else if (req.path.startsWith('/about')) {
    res.locals.activeLink = 'about';
  }
  
  next();
});

// Define public routes (no authentication required)
app.use('/auth', (req, res, next) => next()); // Skip authentication for auth routes

// Protected routes (require authentication)
app.use('/', requireAuth, indexRouter);
app.use('/research', requireAuth, researchRouter);
app.use('/pitch-materials', requireAuth, pitchMaterialsRouter);
app.use('/utilities', requireAuth, utilitiesRouter);

// Create content directories if they don't exist
const contentDirs = [
  'public/uploads',
  'public/content/research',
  'public/content/pitch_materials'
];

contentDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Error handling
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    error: { status: 404 },
    activeLink: null
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).render('error', {
    title: 'Error',
    message: err.message,
    error: app.get('env') === 'development' ? err : {},
    activeLink: null
  });
});

module.exports = app;

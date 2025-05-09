/**
 * CertusBuild AU - Startup Script
 * This script starts the Express application
 */

// Import the main application
const app = require('./app');

// Start the application on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CertusBuild AU server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});
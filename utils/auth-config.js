/**
 * Authentication Configuration for CertusBuild AU App
 * Configures Passport.js with OAuth2 for Authentik SSO integration
 * Also provides a development bypass option for local testing
 */

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// Load environment variables
require('dotenv').config();

// Function to configure authentication
module.exports = function setupAuth(app) {
  // Check if auth bypass is enabled for development or testing
  const authBypassEnabled = process.env.AUTH_BYPASS_ENABLED === 'true';
  
  if (!authBypassEnabled) {
    // Production authentication with Authentik
    // Only load OAuth2Strategy when actually using it
    const OAuth2Strategy = require('passport-oauth2').Strategy;
    
    // Configure passport
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Make sure we have all required environment variables
    const requiredVars = ['AUTH_CLIENT_ID', 'AUTH_CLIENT_SECRET', 'AUTH_ISSUER', 'AUTH_CALLBACK_URL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      console.error('Authentication will not function properly without these variables.');
      process.exit(1); // Exit the process to prevent starting with misconfigured auth
    }
    
    // Extract user profile from Authentik's userinfo endpoint
    const getUserProfile = async (accessToken) => {
      try {
        const response = await fetch(`${process.env.AUTH_ISSUER}userinfo/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    };

    // Configure OAuth2 strategy
    const oauth2Strategy = new OAuth2Strategy({
      authorizationURL: `${process.env.AUTH_ISSUER}authorize/`,
      tokenURL: `${process.env.AUTH_ISSUER}token/`,
      clientID: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      callbackURL: process.env.AUTH_CALLBACK_URL,
      scope: process.env.AUTH_SCOPE?.split(' ') || ['openid', 'profile', 'email']
    }, async (accessToken, refreshToken, params, profile, done) => {
      try {
        // Fetch the user profile from userinfo endpoint
        const userProfile = await getUserProfile(accessToken);
        
        if (!userProfile) {
          return done(new Error('Failed to fetch user profile'));
        }
        
        // Add token information to the profile
        userProfile.accessToken = accessToken;
        userProfile.refreshToken = refreshToken;
        
        return done(null, userProfile);
      } catch (error) {
        return done(error);
      }
    });

    passport.use('oauth2', oauth2Strategy);

    // Setup authentication routes
    app.get('/auth/login', passport.authenticate('oauth2'));

    app.get('/auth/callback',
      passport.authenticate('oauth2', { 
        successReturnToOrRedirect: '/',
        failureRedirect: '/auth/login'
      })
    );

    app.get('/auth/logout', (req, res, next) => {
      req.logout(function(err) {
        if (err) { return next(err); }
        // Redirect to Authentik's logout URL
        res.redirect(`${process.env.AUTH_ISSUER}logout/`);
      });
    });
    
    // Use Passport auth middleware
    const requireAuth = ensureLogin.ensureLoggedIn('/auth/login');
    
    // Make user info available to templates
    app.use((req, res, next) => {
      res.locals.user = req.user || null;
      res.locals.isAuthenticated = req.isAuthenticated();
      next();
    });
    
    return { requireAuth };
    
  } else {
    // Development authentication bypass
    console.log('🔓 DEVELOPMENT MODE: Authentication bypass is enabled');
    
    // Create a simulated auth route
    app.get('/auth/login', (req, res) => {
      // Create a mock user session
      req.session.user = {
        id: 'dev-user',
        name: 'Development User',
        email: 'dev@example.com',
        role: 'admin'
      };
      
      // Redirect to the requested URL or home
      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(returnTo);
    });
    
    // Simulate logout
    app.get('/auth/logout', (req, res) => {
      // Clear the session
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
    
    // Middleware to make user info available to templates
    app.use((req, res, next) => {
      // Always consider the user authenticated in dev mode
      res.locals.user = req.session.user || { 
        id: 'dev-user', 
        name: 'Development User',
        email: 'dev@example.com',
        role: 'admin'
      };
      res.locals.isAuthenticated = true;
      next();
    });
    
    // No auth check in development mode, pass through
    const requireAuth = (req, res, next) => {
      // Auto-login if not already logged in
      if (!req.session.user) {
        req.session.user = { 
          id: 'dev-user', 
          name: 'Development User',
          email: 'dev@example.com',
          role: 'admin'
        };
      }
      next();
    };
    
    return { requireAuth };
  }
};
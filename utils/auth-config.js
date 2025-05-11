/**
 * Authentication Configuration for CertusBuild AU App
 * Configures Passport.js with OAuth2 for Authentik SSO integration
 */

const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const ensureLogin = require('connect-ensure-login');

// Load environment variables
require('dotenv').config();

// Function to configure authentication
module.exports = function setupAuth(app) {
  // Configure passport
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

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
    scope: ['openid', 'profile', 'email']
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

  // Initialize Passport and restore authentication state from session
  app.use(passport.initialize());
  app.use(passport.session());

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

  // Make user info available to templates
  app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });

  // Use this middleware to protect routes
  const requireAuth = ensureLogin.ensureLoggedIn('/auth/login');

  return {
    requireAuth
  };
};
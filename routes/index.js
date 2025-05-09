/**
 * Index routes for CertusBuild AU
 */

const express = require('express');
const router = express.Router();
const path = require('path');

// Home page
router.get('/', (req, res) => {
  res.render('index', {
    title: 'CertusBuild - Intelligent Construction Management',
    activeLink: 'home'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About CertusBuild',
    activeLink: 'about'
  });
});

module.exports = router;
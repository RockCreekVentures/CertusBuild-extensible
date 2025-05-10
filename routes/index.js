/**
 * Index routes for CertusBuild AU
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const showdown = require('showdown');

// Initialize Showdown converter
const converter = new showdown.Converter({
  tables: true,
  strikethrough: true,
  tasklists: true,
  ghCodeBlocks: true,
  emoji: true
});
converter.setFlavor('github');

// Home page
router.get('/', (req, res) => {
  // Get announcements content
  const announcementsPath = path.join(__dirname, '../public/content/announcements/announcements.md');
  let announcementsHtml = null;
  
  if (fs.existsSync(announcementsPath)) {
    const announcementsMarkdown = fs.readFileSync(announcementsPath, 'utf8');
    announcementsHtml = converter.makeHtml(announcementsMarkdown);
  }
  
  res.render('index', {
    title: 'CertusBuild - Intelligent Construction Management',
    activeLink: 'home',
    announcementsHtml
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
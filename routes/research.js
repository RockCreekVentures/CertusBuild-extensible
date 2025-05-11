/**
 * Research routes for CertusBuild AU
 * Handles all research archive content and displays
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const contentManager = require('../utils/content-manager');

// Research index page
router.get('/', (req, res) => {
  // Get all research content
  const researchContent = contentManager.getContentByCategory('public/content', 'research');
  
  res.render('research/index', {
    title: 'Research Archive - CertusBuild',
    activeLink: 'research',
    researchContent
  });
});

// Dynamic route for research content by slug
router.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;
  const content = contentManager.getContentBySlug('public/content', 'research', slug);
  
  if (!content) {
    // If the slug doesn't match any content, try the static routes or 404
    return next();
  }
  
  // Render the content page
  res.render('research/content', {
    title: `${content.title} - CertusBuild`,
    activeLink: 'research',
    activeSection: slug,
    content
  });
});

// Static routes for predefined sections

// Recent Research page
router.get('/recent-research', (req, res) => {
  // Get all research content sorted by date
  const researchContent = contentManager.getContentByCategory('public/content', 'research')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // Get only the 5 most recent items
  
  res.render('research/recent_research', {
    title: 'Recent Research - CertusBuild',
    activeLink: 'research',
    activeSection: 'recent-research',
    researchContent
  });
});

// Research Library page
router.get('/library', (req, res) => {
  // Get all research organized by category
  const researchContent = contentManager.getContentByCategory('public/content', 'research');
  
  res.render('research/library', {
    title: 'Research Library - CertusBuild',
    activeLink: 'research',
    activeSection: 'library',
    researchContent
  });
});

// Market Analysis page
router.get('/market-analysis', (req, res) => {
  res.render('research/market_analysis', {
    title: 'Market & Competitor Analysis - CertusBuild',
    activeLink: 'research',
    activeSection: 'market-analysis'
  });
});

// UX Design page
router.get('/ux-design', (req, res) => {
  res.render('research/ux_design', {
    title: 'UX Design & Research - CertusBuild',
    activeLink: 'research',
    activeSection: 'ux-design'
  });
});

// MVP Definition page
router.get('/mvp-definition', (req, res) => {
  res.render('research/mvp_definition', {
    title: 'MVP Definition & Research - CertusBuild',
    activeLink: 'research',
    activeSection: 'mvp-definition'
  });
});

// Technology Landscape page
router.get('/technology-landscape', (req, res) => {
  res.render('research/technology_landscape', {
    title: 'Technology Landscape - CertusBuild',
    activeLink: 'research',
    activeSection: 'technology-landscape'
  });
});

// Miscellaneous Assets page
router.get('/misc-assets', (req, res) => {
  res.render('research/misc_assets', {
    title: 'Miscellaneous Assets - CertusBuild',
    activeLink: 'research',
    activeSection: 'misc-assets'
  });
});

// API for fetching markdown content
router.get('/api/markdown/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../public/content/research', `${filename}.md`);
  
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      res.send(content);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error(`Error reading markdown file: ${error}`);
    res.status(500).json({ error: 'Failed to read markdown file' });
  }
});

module.exports = router;
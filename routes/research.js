/**
 * Research routes for CertusBuild AU
 * Handles all research archive content and displays
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');

// Research index page
router.get('/', (req, res) => {
  res.render('research/index', {
    title: 'Research Archive - CertusBuild',
    activeLink: 'research'
  });
});

// Market Analysis page
router.get('/market-analysis', (req, res) => {
  res.render('research/market_analysis', {
    title: 'Market & Competitor Analysis - CertusBuild',
    activeLink: 'research'
  });
});

// UX Design page
router.get('/ux-design', (req, res) => {
  res.render('research/ux_design', {
    title: 'UX Design & Research - CertusBuild',
    activeLink: 'research'
  });
});

// MVP Definition page
router.get('/mvp-definition', (req, res) => {
  res.render('research/mvp_definition', {
    title: 'MVP Definition & Research - CertusBuild',
    activeLink: 'research'
  });
});

// Technology Landscape page
router.get('/technology-landscape', (req, res) => {
  res.render('research/technology_landscape', {
    title: 'Technology Landscape - CertusBuild',
    activeLink: 'research'
  });
});

// Miscellaneous Assets page
router.get('/misc-assets', (req, res) => {
  res.render('research/misc_assets', {
    title: 'Miscellaneous Assets - CertusBuild',
    activeLink: 'research'
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
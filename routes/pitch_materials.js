/**
 * Pitch Materials routes for CertusBuild AU
 * Handles pitch deck displays and related content
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const contentManager = require('../utils/content-manager');

// Pitch Materials index page
router.get('/', (req, res) => {
  // Get all pitch materials content
  const pitchContent = contentManager.getContentByCategory('public/content', 'pitch_materials');
  
  res.render('pitch_materials/index', {
    title: 'Pitch Materials - CertusBuild',
    activeLink: 'pitch_materials',
    pitchContent
  });
});

// Dynamic route for pitch materials content by slug
router.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;
  const content = contentManager.getContentBySlug('public/content', 'pitch_materials', slug);
  
  if (!content) {
    // If the slug doesn't match any content, try the static routes or 404
    return next();
  }
  
  // Render the content page
  res.render('pitch_materials/content', {
    title: `${content.title} - CertusBuild`,
    activeLink: 'pitch_materials',
    activeSection: slug,
    content
  });
});

// Static routes for predefined sections

// Recent Additions page
router.get('/recent-additions', (req, res) => {
  // Get all pitch materials content sorted by date
  const pitchContent = contentManager.getContentByCategory('public/content', 'pitch_materials')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // Get only the 5 most recent items
  
  res.render('pitch_materials/recent_additions', {
    title: 'Recent Additions - CertusBuild',
    activeLink: 'pitch_materials',
    activeSection: 'recent-additions',
    pitchContent
  });
});

// Pitch Materials Library page
router.get('/library', (req, res) => {
  // Get all pitch materials organized by category
  const allPitchFiles = contentManager.getContentByCategory('public/content', 'pitch_materials');
  
  // Organize by category
  const categories = {
    'Executive': [],
    'Technical': [],
    'Investor': [],
    'Financial': [],
    'Other': []
  };
  
  allPitchFiles.forEach(file => {
    if (file.title.toLowerCase().includes('executive')) {
      categories.Executive.push(file);
    } else if (file.title.toLowerCase().includes('technical') || file.title.toLowerCase().includes('user')) {
      categories.Technical.push(file);
    } else if (file.title.toLowerCase().includes('investor')) {
      categories.Investor.push(file);
    } else if (file.title.toLowerCase().includes('financial')) {
      categories.Financial.push(file);
    } else {
      categories.Other.push(file);
    }
  });
  
  res.render('pitch_materials/library', {
    title: 'Pitch Materials Library - CertusBuild',
    activeLink: 'pitch_materials',
    activeSection: 'library',
    categories
  });
});

// Executive Summary Deck page
router.get('/executive-summary', (req, res) => {
  res.render('pitch_materials/executive_summary', {
    title: 'Executive Summary Deck - CertusBuild',
    activeLink: 'pitch_materials',
    activeSection: 'executive-summary'
  });
});

// Technical User Workflow Deck page
router.get('/technical-user', (req, res) => {
  res.render('pitch_materials/technical_user', {
    title: 'Technical/User Workflow Pitch Deck - CertusBuild',
    activeLink: 'pitch_materials',
    activeSection: 'technical-user'
  });
});

// Investor Pitch Deck page
router.get('/investor-pitch', (req, res) => {
  res.render('pitch_materials/investor_pitch', {
    title: 'Investor Pitch Deck - CertusBuild',
    activeLink: 'pitch_materials',
    activeSection: 'investor-pitch'
  });
});

// Financials Module page
router.get('/financials', (req, res) => {
  res.render('pitch_materials/financials', {
    title: 'Financials Module - CertusBuild',
    activeLink: 'pitch_materials',
    activeSection: 'financials'
  });
});

// API for fetching markdown content
router.get('/api/markdown/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../public/content/pitch_materials', `${filename}.md`);
  
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
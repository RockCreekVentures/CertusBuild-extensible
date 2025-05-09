/**
 * Pitch Materials routes for CertusBuild AU
 * Handles pitch deck displays and related content
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');

// Pitch Materials index page
router.get('/', (req, res) => {
  res.render('pitch_materials/index', {
    title: 'Pitch Materials - CertusBuild',
    activeLink: 'pitch_materials'
  });
});

// Executive Summary Deck page
router.get('/executive-summary', (req, res) => {
  res.render('pitch_materials/executive_summary', {
    title: 'Executive Summary Deck - CertusBuild',
    activeLink: 'pitch_materials'
  });
});

// Technical User Workflow Deck page
router.get('/technical-user', (req, res) => {
  res.render('pitch_materials/technical_user', {
    title: 'Technical/User Workflow Pitch Deck - CertusBuild',
    activeLink: 'pitch_materials'
  });
});

// Investor Pitch Deck page
router.get('/investor-pitch', (req, res) => {
  res.render('pitch_materials/investor_pitch', {
    title: 'Investor Pitch Deck - CertusBuild',
    activeLink: 'pitch_materials'
  });
});

// Financials Module page
router.get('/financials', (req, res) => {
  res.render('pitch_materials/financials', {
    title: 'Financials Module - CertusBuild',
    activeLink: 'pitch_materials'
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
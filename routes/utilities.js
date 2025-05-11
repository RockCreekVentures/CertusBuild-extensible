/**
 * Utilities routes for CertusBuild AU
 * Handles utilities like file browser and links directory
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');

// Function to get file tree recursively
const getFileTree = (dir, basePath = '') => {
  const result = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    // Skip node_modules and hidden files/folders
    if (file === 'node_modules' || file.startsWith('.')) {
      return;
    }
    
    const filePath = path.join(dir, file);
    const relativePath = path.join(basePath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      result.push({
        name: file,
        path: relativePath,
        type: 'directory',
        children: getFileTree(filePath, relativePath)
      });
    } else {
      result.push({
        name: file,
        path: relativePath,
        type: 'file',
        size: stats.size,
        extension: path.extname(file)
      });
    }
  });
  
  return result;
};

// Get appropriate icon class for file type
const getFileIconClass = (file) => {
  const ext = path.extname(file.name).toLowerCase();
  
  if (file.type === 'directory') {
    return 'fa-folder';
  }
  
  switch(ext) {
    case '.js':
      return 'fa-js';
    case '.css':
      return 'fa-css3';
    case '.html':
    case '.ejs':
      return 'fa-html5';
    case '.json':
      return 'fa-code';
    case '.md':
      return 'fa-file-alt';
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.svg':
      return 'fa-image';
    case '.pdf':
      return 'fa-file-pdf';
    case '.doc':
    case '.docx':
      return 'fa-file-word';
    case '.xls':
    case '.xlsx':
      return 'fa-file-excel';
    case '.ppt':
    case '.pptx':
      return 'fa-file-powerpoint';
    case '.zip':
    case '.rar':
    case '.tar':
    case '.gz':
      return 'fa-file-archive';
    default:
      return 'fa-file';
  }
};

// Function to determine if a file is viewable in browser
const isViewableInBrowser = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const viewableExtensions = [
    '.html', '.htm', '.txt', '.md', '.css', '.js', '.json',
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
    '.pdf', '.mp4', '.webm', '.ogg', '.mp3', '.wav'
  ];
  
  return viewableExtensions.includes(ext);
};

// Utilities index page
router.get('/', (req, res) => {
  // Get file tree starting from root
  const fileTree = getFileTree(path.join(process.cwd()));
  
  // Placeholder for links directory (you'll need to implement a database or file-based system)
  const links = [
    { name: 'CertusBuild GitHub Repository', url: 'https://github.com/certusbuild/platform', description: 'Main code repository for the CertusBuild platform' },
    { name: 'Project Documentation', url: 'https://docs.certusbuild.com', description: 'Official documentation for developers and users' },
    { name: 'Design Assets Figma', url: 'https://figma.com/file/certusbuild-design-system', description: 'Figma design assets and components' },
    { name: 'Project Management', url: 'https://trello.com/certusbuild', description: 'Trello board for project management and tasks' }
  ];
  
  res.render('utilities/index', {
    title: 'Utilities - CertusBuild',
    activeLink: 'utilities',
    fileTree,
    getFileIconClass,
    isViewableInBrowser,
    links
  });
});

// Helper function to serve files
const serveFile = (req, res, filePath) => {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).render('error', {
      title: 'File Not Found',
      message: `The file does not exist.`,
      error: { status: 404 },
      activeLink: 'utilities'
    });
  }
  
  // Check if it's a directory
  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    return res.redirect('/utilities');
  }
  
  // Check if the file is viewable in browser
  if (isViewableInBrowser(filePath)) {
    // For text-based files, send the content
    const ext = path.extname(filePath).toLowerCase();
    if (['.txt', '.md', '.html', '.htm', '.css', '.js', '.json'].includes(ext)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // For markdown files, render with markdown
      if (ext === '.md') {
        return res.render('utilities/markdown-viewer', {
          title: path.basename(filePath) + ' - CertusBuild',
          activeLink: 'utilities',
          filename: path.basename(filePath),
          filepath: filePath,
          content
        });
      }
      
      // For code files, render with syntax highlighting
      if (['.css', '.js', '.json', '.html', '.htm'].includes(ext)) {
        return res.render('utilities/code-viewer', {
          title: path.basename(filePath) + ' - CertusBuild',
          activeLink: 'utilities',
          filename: path.basename(filePath),
          filepath: filePath,
          content,
          language: ext.substring(1) // remove the dot
        });
      }
      
      // For plain text, render as is
      return res.render('utilities/text-viewer', {
        title: path.basename(filePath) + ' - CertusBuild',
        activeLink: 'utilities',
        filename: path.basename(filePath),
        filepath: filePath,
        content
      });
    }
    
    // For media and PDF files, serve the file directly
    return res.sendFile(filePath);
  } else {
    // Force download for non-viewable files
    res.download(filePath);
  }
};

// File view/download route for research archive
router.get('/file/research_archive/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'research_archive', req.params.filename);
  serveFile(req, res, filePath);
});

// File view/download route for research content
router.get('/file/public/content/research/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'public/content/research', req.params.filename);
  serveFile(req, res, filePath);
});

// File view/download route for pitch materials content
router.get('/file/public/content/pitch_materials/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'public/content/pitch_materials', req.params.filename);
  serveFile(req, res, filePath);
});

// File view/download route for pitch materials
router.get('/file/pitch_materials/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'pitch_materials', req.params.filename);
  serveFile(req, res, filePath);
});

// File view/download route for attached assets
router.get('/file/attached_assets/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'attached_assets', req.params.filename);
  serveFile(req, res, filePath);
});

// General file viewing route (fallback)
router.get('/file/:filepath', (req, res) => {
  const filePath = path.join(process.cwd(), req.params.filepath);
  serveFile(req, res, filePath);
});

// Links management page
router.get('/links', (req, res) => {
  // Placeholder for links directory
  const links = [
    { name: 'CertusBuild GitHub Repository', url: 'https://github.com/certusbuild/platform', description: 'Main code repository for the CertusBuild platform' },
    { name: 'Project Documentation', url: 'https://docs.certusbuild.com', description: 'Official documentation for developers and users' },
    { name: 'Design Assets Figma', url: 'https://figma.com/file/certusbuild-design-system', description: 'Figma design assets and components' },
    { name: 'Project Management', url: 'https://trello.com/certusbuild', description: 'Trello board for project management and tasks' }
  ];
  
  res.render('utilities/links', {
    title: 'Links Directory - CertusBuild',
    activeLink: 'utilities',
    links
  });
});

module.exports = router;
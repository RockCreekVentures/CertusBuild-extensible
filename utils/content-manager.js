/**
 * Content Manager Utility
 * Handles dynamic content discovery and organization
 */

const fs = require('fs-extra');
const path = require('path');
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

/**
 * Get metadata from markdown content
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Metadata object
 */
const getContentMetadata = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract title from first heading
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
    
    // Extract description from first paragraph after heading
    const descriptionMatch = content.match(/^#.+\n+([^\n#].+)(?:\n|$)/m);
    const description = descriptionMatch 
      ? descriptionMatch[1].substring(0, 180) + (descriptionMatch[1].length > 180 ? '...' : '')
      : 'No description available';
    
    // Get content creation date (or file creation date)
    const stats = fs.statSync(filePath);
    const createdDate = stats.birthtime;
    
    // Get content categories from directory structure
    const category = path.basename(path.dirname(filePath));
    
    return {
      title,
      description,
      createdDate,
      category,
      filePath: filePath.replace(/\\/g, '/'),
      slug: path.basename(filePath, '.md').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
  } catch (error) {
    console.error(`Error extracting metadata from ${filePath}:`, error);
    return {
      title: path.basename(filePath, '.md'),
      description: 'No description available',
      createdDate: new Date(),
      category: path.basename(path.dirname(filePath)),
      filePath: filePath.replace(/\\/g, '/'),
      slug: path.basename(filePath, '.md').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
  }
};

/**
 * Scan content directories to find markdown files
 * @param {string} baseDir - Base directory to scan
 * @returns {Array} - Array of content items with metadata
 */
const scanContentDirectories = (baseDir) => {
  const contentItems = [];
  const contentDir = path.join(process.cwd(), baseDir);
  
  // Check if directory exists
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory ${contentDir} does not exist`);
    return contentItems;
  }
  
  // Get categories (subdirectories)
  const categories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Scan each category for markdown files
  categories.forEach(category => {
    const categoryDir = path.join(contentDir, category);
    
    // Get all markdown files in this category
    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.md'));
    
    // Process each file
    files.forEach(file => {
      const filePath = path.join(categoryDir, file);
      const metadata = getContentMetadata(filePath);
      
      // Add to content items
      contentItems.push({
        ...metadata,
        relativePath: path.relative(process.cwd(), filePath).replace(/\\/g, '/'),
        url: `/${category}/${metadata.slug}`
      });
    });
  });
  
  // Sort by created date (newest first)
  return contentItems.sort((a, b) => b.createdDate - a.createdDate);
};

/**
 * Get content by category
 * @param {string} baseDir - Base content directory
 * @param {string} category - Category to filter by
 * @returns {Array} - Filtered content items
 */
const getContentByCategory = (baseDir, category) => {
  const allContent = scanContentDirectories(baseDir);
  return category 
    ? allContent.filter(item => item.category === category)
    : allContent;
};

/**
 * Get single content item by slug
 * @param {string} baseDir - Base content directory
 * @param {string} category - Content category
 * @param {string} slug - Content slug
 * @returns {Object} - Content item with full HTML
 */
const getContentBySlug = (baseDir, category, slug) => {
  const contentDir = path.join(process.cwd(), baseDir, category);
  
  // Look for file with matching slug
  const files = fs.readdirSync(contentDir)
    .filter(file => file.endsWith('.md') && 
      file.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/\.md$/, '') === slug);
  
  if (files.length === 0) {
    return null;
  }
  
  // Get metadata
  const filePath = path.join(contentDir, files[0]);
  const metadata = getContentMetadata(filePath);
  
  // Get full content
  const markdown = fs.readFileSync(filePath, 'utf8');
  const htmlContent = converter.makeHtml(markdown);
  
  return {
    ...metadata,
    htmlContent,
    markdown
  };
};

module.exports = {
  scanContentDirectories,
  getContentByCategory,
  getContentBySlug
};
/**
 * CertusBuild Markdown Renderer
 * This script handles rendering markdown files into HTML content
 */

// Initialize Showdown converter
const initializeConverter = () => {
    const converter = new showdown.Converter({
        tables: true,
        strikethrough: true,
        tasklists: true,
        ghCodeBlocks: true,
        emoji: true
    });
    converter.setFlavor('github');
    return converter;
};

// Fetch markdown file and render it
const renderMarkdownFile = (container, markdownFile) => {
    // Show loading spinner
    container.innerHTML = `
        <div class="d-flex justify-content-center align-items-center py-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Fetch the markdown file
    fetch(markdownFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load markdown file: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(markdown => {
            // Initialize converter
            const converter = initializeConverter();
            
            // Convert markdown to HTML
            const html = converter.makeHtml(markdown);
            
            // Insert the HTML content
            container.innerHTML = html;
            
            // Apply styling classes to elements
            enhanceMarkdownStyling(container);
        })
        .catch(error => {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error loading markdown: ${error.message}
                </div>
            `;
            console.error('Error loading markdown:', error);
        });
};

// Enhance the styling of markdown content
const enhanceMarkdownStyling = (container) => {
    // Add classes to headings
    container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        heading.classList.add('markdown-heading');
    });
    
    // Add classes to tables
    container.querySelectorAll('table').forEach(table => {
        table.classList.add('table', 'table-striped', 'table-bordered', 'markdown-table');
    });
    
    // Add classes to code blocks
    container.querySelectorAll('pre').forEach(pre => {
        pre.classList.add('markdown-pre');
        pre.querySelectorAll('code').forEach(code => {
            code.classList.add('markdown-code');
        });
    });
    
    // Add classes to blockquotes
    container.querySelectorAll('blockquote').forEach(blockquote => {
        blockquote.classList.add('markdown-blockquote');
    });
    
    // Add classes to images
    container.querySelectorAll('img').forEach(img => {
        img.classList.add('img-fluid', 'markdown-img');
    });
    
    // Add classes to lists
    container.querySelectorAll('ul, ol').forEach(list => {
        list.classList.add('markdown-list');
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Look for elements with data-markdown-file attribute
    const markdownContainers = document.querySelectorAll('[data-markdown-file]');
    
    markdownContainers.forEach(container => {
        const markdownFile = container.getAttribute('data-markdown-file');
        if (markdownFile) {
            renderMarkdownFile(container, markdownFile);
        }
    });

    // Add toggle functionality for markdown content
    document.querySelectorAll('.toggle-content-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cardBody = this.closest('.card-header').nextElementSibling;
            const content = cardBody.querySelector('.markdown-content');
            const cardFooter = this.closest('.card').querySelector('.card-footer');
            
            // Toggle visibility
            const isVisible = !content.classList.contains('hidden-content');
            content.classList.toggle('hidden-content');
            
            // Update button text
            if (isVisible) {
                this.innerHTML = '<i class="fas fa-eye"></i> View Content';
                if (cardFooter) cardFooter.style.display = 'none';
            } else {
                this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Content';
                if (cardFooter) cardFooter.style.display = 'block';
                
                // Load content if not already loaded
                const contentDiv = content.querySelector('div');
                if (contentDiv && !contentDiv.dataset.loaded) {
                    // Fetch markdown file
                    const markdownFile = contentDiv.getAttribute('data-markdown-file');
                    if (markdownFile) {
                        fetch(markdownFile)
                            .then(response => {
                                if (!response.ok) throw new Error('Failed to load markdown');
                                return response.text();
                            })
                            .then(markdown => {
                                // Convert markdown to HTML using Showdown
                                const converter = initializeConverter();
                                const html = converter.makeHtml(markdown);
                                
                                // Insert the HTML content
                                contentDiv.innerHTML = html;
                                contentDiv.dataset.loaded = 'true';
                                
                                // Apply styling
                                enhanceMarkdownStyling(contentDiv);
                            })
                            .catch(error => {
                                contentDiv.innerHTML = `
                                    <div class="alert alert-danger">
                                        <i class="fas fa-exclamation-triangle me-2"></i>
                                        Error loading content: ${error.message}
                                    </div>
                                `;
                                console.error('Error loading markdown:', error);
                            });
                    }
                }
            }
        });
    });
});
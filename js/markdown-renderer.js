// Markdown renderer using Showdown.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the converter
    const converter = new showdown.Converter({
        tables: true,
        strikethrough: true,
        tasklists: true,
        ghCodeBlocks: true,
        emoji: true
    });
    
    // Set some defaults
    converter.setFlavor('github');
    
    // Find all markdown containers
    const markdownContainers = document.querySelectorAll('.markdown-content');
    
    // Process each markdown container
    markdownContainers.forEach(container => {
        // Get the file path from data attribute
        const filePath = container.getAttribute('data-markdown-file');
        if (filePath) {
            // Fetch the markdown file
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load markdown file: ${response.status} ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(markdown => {
                    // Convert markdown to HTML
                    const html = converter.makeHtml(markdown);
                    
                    // Insert the HTML content
                    container.innerHTML = html;
                    
                    // Add classes to elements for better styling
                    container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                        heading.classList.add('markdown-heading');
                    });
                    
                    container.querySelectorAll('table').forEach(table => {
                        table.classList.add('table', 'table-striped', 'table-bordered', 'markdown-table');
                    });
                    
                    container.querySelectorAll('pre').forEach(pre => {
                        pre.classList.add('markdown-pre');
                        pre.querySelectorAll('code').forEach(code => {
                            code.classList.add('markdown-code');
                        });
                    });
                    
                    container.querySelectorAll('blockquote').forEach(blockquote => {
                        blockquote.classList.add('markdown-blockquote');
                    });
                    
                    container.querySelectorAll('img').forEach(img => {
                        img.classList.add('img-fluid', 'markdown-img');
                    });
                    
                    // Emit an event when content is loaded
                    container.dispatchEvent(new Event('markdown-rendered'));
                })
                .catch(error => {
                    container.innerHTML = `<div class="alert alert-danger">Error loading markdown: ${error.message}</div>`;
                    console.error('Error loading markdown:', error);
                });
        } else {
            container.innerHTML = '<div class="alert alert-warning">No markdown file specified</div>';
        }
    });
});
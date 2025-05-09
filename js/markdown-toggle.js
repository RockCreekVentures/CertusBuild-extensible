document.addEventListener('DOMContentLoaded', function() {
    // Hide all markdown content initially and add toggle buttons
    document.querySelectorAll('.markdown-content').forEach(content => {
        // Add a hide class
        content.classList.add('hidden-content');
        
        // Get the card header for this content
        const cardBody = content.closest('.card-body');
        const card = cardBody.closest('.card');
        const cardHeader = card.querySelector('.card-header');
        
        if (cardHeader) {
            // Create toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn btn-sm btn-outline-secondary float-end toggle-content-btn';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i> View Content';
            toggleBtn.setAttribute('type', 'button');
            
            // Add click event
            toggleBtn.addEventListener('click', function() {
                const isVisible = !content.classList.contains('hidden-content');
                
                if (isVisible) {
                    // Hide content
                    content.classList.add('hidden-content');
                    this.innerHTML = '<i class="fas fa-eye"></i> View Content';
                } else {
                    // Show content
                    content.classList.remove('hidden-content');
                    this.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Content';
                    
                    // Check if content is already loaded
                    const contentDiv = content.querySelector('div');
                    if (contentDiv && !contentDiv.dataset.loaded) {
                        loadMarkdownContent(contentDiv.id);
                        contentDiv.dataset.loaded = 'true';
                    }
                }
            });
            
            // Add button to header
            cardHeader.appendChild(toggleBtn);
        }
    });
    
    // Function to load markdown content on demand
    function loadMarkdownContent(contentId) {
        if (!contentId) return;
        
        const contentElement = document.getElementById(contentId);
        if (!contentElement) return;
        
        // Show loading spinner
        contentElement.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        // Define mapping for content IDs to their markdown sources and processors
        const contentMap = {
            'comparative-summary-content': {
                url: '../attached_assets/comparative_ux_analysis.md',
                processor: function(markdown, converter) {
                    // Extract the table section
                    const tableSection = markdown.match(/\| Feature\/Aspect.*?\n\n/s);
                    if (tableSection) {
                        const tableHtml = converter.makeHtml(tableSection[0]);
                        
                        // Use a container div with fixed height and overflow control
                        const container = document.createElement('div');
                        container.className = 'markdown-preview-container table-container';
                        container.innerHTML = tableHtml;
                        
                        contentElement.innerHTML = '';
                        contentElement.appendChild(container);
                        
                        // Add Bootstrap classes to the table
                        const table = contentElement.querySelector('table');
                        if (table) {
                            table.classList.add('table', 'table-striped', 'table-bordered', 'table-responsive');
                        }
                    } else {
                        contentElement.innerHTML = '<div class="alert alert-warning">Table content not found in the markdown file.</div>';
                    }
                }
            },
            'mvp-recommendations-content': {
                url: '../attached_assets/comparative_ux_analysis.md',
                processor: function(markdown, converter) {
                    // Extract the recommendations section
                    const recommendationsSection = markdown.match(/## 5\. Recommendations for MVP UX[\s\S]*?(?=##|$)/);
                    if (recommendationsSection) {
                        const recommendationsHtml = converter.makeHtml(recommendationsSection[0]);
                        
                        // Use a container div with fixed height and overflow control
                        const container = document.createElement('div');
                        container.className = 'markdown-preview-container';
                        container.innerHTML = recommendationsHtml;
                        
                        contentElement.innerHTML = '';
                        contentElement.appendChild(container);
                        
                        // Add styling to elements
                        contentElement.querySelectorAll('h2, h3').forEach(heading => {
                            heading.classList.add('markdown-heading');
                        });
                        
                        contentElement.querySelectorAll('ul, ol').forEach(list => {
                            list.classList.add('markdown-list');
                        });
                    } else {
                        contentElement.innerHTML = '<div class="alert alert-warning">Recommendations content not found in the markdown file.</div>';
                    }
                }
            },
            'workspace-design-content': {
                url: '../attached_assets/workspace_design_synthesis.md',
                processor: function(markdown, converter) {
                    const html = converter.makeHtml(markdown);
                    
                    // Use a container div with fixed height and overflow control
                    const container = document.createElement('div');
                    container.className = 'markdown-preview-container';
                    container.innerHTML = html;
                    
                    contentElement.innerHTML = '';
                    contentElement.appendChild(container);
                }
            },
            'wireframe-annotations-content': {
                url: '../attached_assets/wireframe_annotations.md',
                processor: function(markdown, converter) {
                    const html = converter.makeHtml(markdown);
                    
                    // Use a container div with fixed height and overflow control
                    const container = document.createElement('div');
                    container.className = 'markdown-preview-container';
                    container.innerHTML = html;
                    
                    contentElement.innerHTML = '';
                    contentElement.appendChild(container);
                }
            }
        };
        
        // Get content configuration
        const contentConfig = contentMap[contentId];
        if (!contentConfig) {
            contentElement.innerHTML = '<div class="alert alert-warning">No configuration found for this content.</div>';
            return;
        }
        
        // Initialize Showdown converter
        const converter = new showdown.Converter({
            tables: true,
            strikethrough: true,
            tasklists: true,
            ghCodeBlocks: true,
            emoji: true
        });
        converter.setFlavor('github');
        
        // Fetch and process the markdown
        fetch(contentConfig.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load markdown file');
                }
                return response.text();
            })
            .then(markdown => {
                contentConfig.processor(markdown, converter);
            })
            .catch(error => {
                console.error(`Error loading markdown content: ${error}`);
                contentElement.innerHTML = `<div class="alert alert-danger">Error loading content: ${error.message}</div>`;
            });
    }
});
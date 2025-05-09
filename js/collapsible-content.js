document.addEventListener('DOMContentLoaded', function() {
    // Set up all collapsible sections
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
        // Add click event to toggle content
        header.addEventListener('click', function() {
            const contentId = this.getAttribute('data-content');
            const contentSection = document.getElementById(contentId);
            const isActive = this.classList.contains('active');
            
            // Toggle active state for header
            this.classList.toggle('active');
            
            // Toggle content visibility
            if (contentSection) {
                contentSection.classList.toggle('active');
                
                // If opening and content not yet loaded
                if (!isActive && contentSection.getAttribute('data-loaded') !== 'true') {
                    loadMarkdownContent(contentId);
                    contentSection.setAttribute('data-loaded', 'true');
                    
                    // Update status indicator
                    const statusIndicator = this.querySelector('.status-indicator');
                    if (statusIndicator) {
                        statusIndicator.classList.remove('status-unloaded');
                        statusIndicator.classList.add('status-loaded');
                        statusIndicator.textContent = 'Loaded';
                    }
                }
            }
        });
    });
    
    // Function to load markdown content
    function loadMarkdownContent(contentId) {
        if (!contentId) return;
        
        const contentSection = document.getElementById(contentId);
        if (!contentSection) return;
        
        const contentBody = contentSection.querySelector('.collapsible-body');
        if (!contentBody) return;
        
        // Show loading indicator
        contentBody.innerHTML = '<div class="text-center"><div class="loading-spinner"></div> Loading content...</div>';
        
        // Define content mapping
        const contentMap = {
            'comparative-summary-content': {
                url: '../attached_assets/comparative_ux_analysis.md',
                processor: function(markdown) {
                    // Extract the table section
                    const tableSection = markdown.match(/\| Feature\/Aspect.*?\n\n/s);
                    if (tableSection) {
                        const converter = new showdown.Converter({tables: true});
                        const tableHtml = converter.makeHtml(tableSection[0]);
                        
                        // Create container
                        const container = document.createElement('div');
                        container.className = 'markdown-preview-container table-container';
                        container.innerHTML = tableHtml;
                        
                        // Clear content and append container
                        contentBody.innerHTML = '';
                        contentBody.appendChild(container);
                        
                        // Add Bootstrap classes to the table
                        const table = contentBody.querySelector('table');
                        if (table) {
                            table.classList.add('table', 'table-striped', 'table-bordered', 'table-responsive');
                        }
                    } else {
                        contentBody.innerHTML = '<div class="alert alert-warning">Table content not found in the markdown file.</div>';
                    }
                }
            },
            'workspace-design-content': {
                url: '../attached_assets/workspace_design_synthesis.md',
                processor: function(markdown) {
                    const converter = new showdown.Converter();
                    const html = converter.makeHtml(markdown);
                    
                    // Create container
                    const container = document.createElement('div');
                    container.className = 'markdown-preview-container';
                    container.innerHTML = html;
                    
                    // Clear content and append container
                    contentBody.innerHTML = '';
                    contentBody.appendChild(container);
                }
            },
            'mvp-recommendations-content': {
                url: '../attached_assets/comparative_ux_analysis.md',
                processor: function(markdown) {
                    // Extract the recommendations section
                    const recommendationsSection = markdown.match(/## 5\. Recommendations for MVP UX[\s\S]*?(?=##|$)/);
                    if (recommendationsSection) {
                        const converter = new showdown.Converter();
                        const recommendationsHtml = converter.makeHtml(recommendationsSection[0]);
                        
                        // Create container
                        const container = document.createElement('div');
                        container.className = 'markdown-preview-container';
                        container.innerHTML = recommendationsHtml;
                        
                        // Clear content and append container
                        contentBody.innerHTML = '';
                        contentBody.appendChild(container);
                    } else {
                        contentBody.innerHTML = '<div class="alert alert-warning">Recommendations content not found in the markdown file.</div>';
                    }
                }
            },
            'wireframe-annotations-content': {
                url: '../attached_assets/wireframe_annotations.md',
                processor: function(markdown) {
                    const converter = new showdown.Converter();
                    const html = converter.makeHtml(markdown);
                    
                    // Create container
                    const container = document.createElement('div');
                    container.className = 'markdown-preview-container';
                    container.innerHTML = html;
                    
                    // Clear content and append container
                    contentBody.innerHTML = '';
                    contentBody.appendChild(container);
                }
            }
        };
        
        // Get content configuration
        const contentConfig = contentMap[contentId];
        if (!contentConfig) {
            contentBody.innerHTML = '<div class="alert alert-warning">No configuration found for this content.</div>';
            return;
        }
        
        // Fetch and process the markdown
        fetch(contentConfig.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load markdown file');
                }
                return response.text();
            })
            .then(markdown => {
                contentConfig.processor(markdown);
            })
            .catch(error => {
                console.error(`Error loading markdown content: ${error}`);
                contentBody.innerHTML = `<div class="alert alert-danger">Error loading content: ${error.message}</div>`;
            });
    }
});
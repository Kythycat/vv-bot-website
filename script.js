/**
 * Velvet Vendetta - Main Script
 * Handles OAuth authentication and page transitions with history support
 */

// Get Discord ID from URL parameter (if coming from Discord)
const urlParams = new URLSearchParams(window.location.search);
const discordId = urlParams.get('discordId');

/**
 * Redirect to Roblox OAuth authorization page
 */
function redirectToAuth() {
    const clientId = '5689277493290998256';
    const redirectUri = encodeURIComponent('https://amanda-conducting-argued-golden.trycloudflare.com/callback');
    const scope = 'openid profile';
    const state = discordId || 'default';
    
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
    
    window.location.href = authUrl;
}

/**
 * Handle page navigation with proper history support
 */
document.addEventListener('DOMContentLoaded', () => {
    // Store current page for history handling
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Handle all navigation links
    const navLinks = document.querySelectorAll('a[data-navigation="true"], a[href$=".html"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html')) {
                e.preventDefault();
                
                // Add fade out animation
                const container = document.querySelector('.container');
                if (container) {
                    container.style.animation = 'pageFadeOut 0.25s ease forwards';
                    
                    setTimeout(() => {
                        // Use pushState for history
                        window.history.pushState({ page: href }, '', href);
                        loadPage(href);
                    }, 250);
                } else {
                    window.location.href = href;
                }
            }
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        const targetPage = window.location.pathname.split('/').pop() || 'index.html';
        loadPage(targetPage, true);
    });
    
    console.log('✨ Velvet Vendetta - System Online');
});

/**
 * Load page content dynamically
 */
function loadPage(page, isHistoryNavigation = false) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            // Extract body content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('.container');
            const newTitle = doc.querySelector('title').innerText;
            
            if (newContent) {
                // Update page content
                const oldContainer = document.querySelector('.container');
                if (oldContainer) {
                    oldContainer.style.animation = 'none';
                    oldContainer.outerHTML = newContent.outerHTML;
                }
                
                // Update title
                document.title = newTitle;
                
                // Re-attach event listeners to new content
                reattachEventListeners();
                
                // Fade in new content
                const container = document.querySelector('.container');
                if (container) {
                    container.style.animation = 'pageFadeIn 0.35s ease forwards';
                }
            } else {
                // Fallback to full page reload
                window.location.href = page;
            }
        })
        .catch(error => {
            console.error('Navigation error:', error);
            window.location.href = page;
        });
}

/**
 * Reattach event listeners after dynamic content load
 */
function reattachEventListeners() {
    // Reattach navigation links
    const navLinks = document.querySelectorAll('a[data-navigation="true"], a[href$=".html"]');
    navLinks.forEach(link => {
        link.removeEventListener('click', handleNavClick);
        link.addEventListener('click', handleNavClick);
    });
    
    // Reattach link button if on index page
    const linkButton = document.getElementById('linkButton');
    if (linkButton && typeof redirectToAuth === 'function') {
        linkButton.onclick = redirectToAuth;
    }
}

function handleNavClick(e) {
    const href = this.getAttribute('href');
    if (href && href.endsWith('.html')) {
        e.preventDefault();
        
        const container = document.querySelector('.container');
        if (container) {
            container.style.animation = 'pageFadeOut 0.25s ease forwards';
            
            setTimeout(() => {
                window.history.pushState({ page: href }, '', href);
                loadPage(href);
            }, 250);
        } else {
            window.location.href = href;
        }
    }
}

// Add fade out animation
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes pageFadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-15px);
        }
    }
`;
document.head.appendChild(fadeStyle);
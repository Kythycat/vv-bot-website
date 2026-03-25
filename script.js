/**
 * Velvet Vendetta - Main Script
 * Handles OAuth authentication and page transitions with history support
 */

// Configuration
const CONFIG = {
    clientId: '5689277493290998256',
    redirectUri: window.location.origin + '/auth',
    scope: 'openid profile'
};

// Get Discord ID from URL parameter (if coming from Discord)
const urlParams = new URLSearchParams(window.location.search);
const discordId = urlParams.get('discordId');

/**
 * Redirect to Roblox OAuth authorization page
 */
function redirectToAuth() {
    const state = discordId || 'default';
    
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${CONFIG.clientId}&redirect_uri=${encodeURIComponent(CONFIG.redirectUri)}&scope=${CONFIG.scope}&response_type=code&state=${state}`;
    
    window.location.href = authUrl;
}

/**
 * Page transition for internal links
 */
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a[data-navigation="true"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
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
        });
    });
    
    window.addEventListener('popstate', (event) => {
        const targetPage = window.location.pathname.split('/').pop() || 'index.html';
        loadPage(targetPage, true);
    });
    
    console.log('✨ Velvet Vendetta - System Online');
});

function loadPage(page, isHistoryNavigation = false) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('.container');
            const newTitle = doc.querySelector('title').innerText;
            
            if (newContent) {
                const oldContainer = document.querySelector('.container');
                if (oldContainer) {
                    oldContainer.style.animation = 'none';
                    oldContainer.outerHTML = newContent.outerHTML;
                }
                
                document.title = newTitle;
                reattachEventListeners();
                
                const container = document.querySelector('.container');
                if (container) {
                    container.style.animation = 'pageFadeIn 0.35s ease forwards';
                }
            } else {
                window.location.href = page;
            }
        })
        .catch(error => {
            console.error('Navigation error:', error);
            window.location.href = page;
        });
}

function reattachEventListeners() {
    const navLinks = document.querySelectorAll('a[data-navigation="true"]');
    navLinks.forEach(link => {
        link.removeEventListener('click', handleNavClick);
        link.addEventListener('click', handleNavClick);
    });
    
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
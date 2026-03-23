/**
 * Velvet Vendetta - Main Script
 * Handles OAuth authentication and page transitions
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
 * Page transition for internal links
 */
document.addEventListener('DOMContentLoaded', () => {
    const internalLinks = document.querySelectorAll('a[href$=".html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && (href.includes('index') || href.includes('terms') || href.includes('privacy'))) {
                e.preventDefault();
                
                const container = document.querySelector('.container');
                if (container) {
                    container.style.animation = 'pageFadeOut 0.3s ease forwards';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                } else {
                    window.location.href = href;
                }
            }
        });
    });
    
    console.log('System Online');
});

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
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(fadeStyle);
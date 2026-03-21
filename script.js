// Get Discord ID from URL parameter (if coming from Discord)
const urlParams = new URLSearchParams(window.location.search);
const discordId = urlParams.get('discordId');

function redirectToAuth() {
    // These will be replaced with  actual values from .env
    const clientId = '5689277493290998256'; // Will update after Roblox OAuth setup
    const redirectUri = encodeURIComponent('https://amanda-conducting-argued-golden.trycloudflare.com/callback'); // Wispbyte bot URL
    const scope = 'openid profile';
    
    // Generate random state for security
    const state = discordId || 'default';
    
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
    
    window.location.href = authUrl;
}

// Set invite link
document.getElementById('inviteLink').addEventListener('click', (e) => {
    e.preventDefault();
    const inviteUrl = 'YOUR_DISCORD_BOT_INVITE_URL'; // Will update after Discord bot creation
    window.open(inviteUrl, '_blank');
});
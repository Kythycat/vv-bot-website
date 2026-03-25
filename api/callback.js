import axios from 'axios';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { code, discordId } = req.body;
    
    // Log for debugging (will appear in Vercel function logs)
    console.log('Callback received:', { code: code?.substring(0, 10), discordId });
    
    if (!code || !discordId) {
        console.log('Missing parameters');
        return res.status(400).json({ error: 'Missing code or discordId' });
    }
    
    try {
        // Exchange code for Roblox token
        console.log('Exchanging code with Roblox...');
        
        const tokenParams = new URLSearchParams({
            client_id: process.env.ROBLOX_CLIENT_ID,
            client_secret: process.env.ROBLOX_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code
        });
        
        const tokenRes = await axios.post('https://apis.roblox.com/oauth/v1/token', tokenParams, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        console.log('Token exchange successful');
        
        const accessToken = tokenRes.data.access_token;
        const userRes = await axios.get('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const robloxId = userRes.data.sub;
        const robloxName = userRes.data.name || userRes.data.preferred_username;
        
        console.log('Roblox user:', { robloxName, robloxId });
        
        // Call your bot's webhook
        const botWebhookUrl = process.env.BOT_WEBHOOK_URL;
        
        if (!botWebhookUrl) {
            console.error('BOT_WEBHOOK_URL not configured');
            return res.status(500).json({ error: 'BOT_WEBHOOK_URL not configured' });
        }
        
        console.log('Calling bot webhook:', botWebhookUrl);
        
        const linkResponse = await axios.post(botWebhookUrl, {
            discordId: discordId,
            robloxId: robloxId,
            robloxName: robloxName
        }, { timeout: 10000 });
        
        console.log('Bot response:', linkResponse.data);
        
        return res.json(linkResponse.data);
        
    } catch (error) {
        console.error('OAuth error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack
        });
        
        return res.status(500).json({ 
            success: false,
            error: error.response?.data?.error_description || error.message || 'Authentication failed'
        });
    }
}
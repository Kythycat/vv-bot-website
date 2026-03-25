const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Missing code' });
    }
    
    try {
        // Exchange code for Roblox token
        const tokenParams = new URLSearchParams({
            client_id: process.env.ROBLOX_CLIENT_ID,
            client_secret: process.env.ROBLOX_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code
        });
        
        const tokenRes = await axios.post('https://apis.roblox.com/oauth/v1/token', tokenParams, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const accessToken = tokenRes.data.access_token;
        const userRes = await axios.get('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const robloxId = userRes.data.sub;
        const robloxName = userRes.data.name || userRes.data.preferred_username;
        
        return res.json({
            success: true,
            robloxId: robloxId,
            robloxName: robloxName
        });
        
    } catch (error) {
        console.error('Exchange error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            error: error.response?.data?.error_description || 'Failed to exchange code' 
        });
    }
};
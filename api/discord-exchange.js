const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
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
        // Exchange code for Discord access token
        const tokenParams = new URLSearchParams({
            client_id: '1483096872011829370',
            client_secret: 'zdHNLR4DJi4g8ipT-WJ4R33vVFtuVvDK',
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `${process.env.WEBSITE_URL || 'https://velvet-vendetta-puce.vercel.app'}/discord-callback`
        });
        
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', tokenParams, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        const accessToken = tokenRes.data.access_token;
        
        // Get Discord user info
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const user = userRes.data;
        
        return res.json({
            success: true,
            id: user.id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar
        });
        
    } catch (error) {
        console.error('Discord exchange error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            error: error.response?.data?.error_description || 'Failed to exchange code' 
        });
    }
};
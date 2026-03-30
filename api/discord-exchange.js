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
            redirect_uri: 'https://velvet-vendetta-puce.vercel.app/discord-callback'
        });
        
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: tokenParams.toString()
        });
        
        const tokenData = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
            console.error('Discord token error:', tokenData);
            throw new Error(tokenData.error_description || 'Failed to get access token');
        }
        
        // Get Discord user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });
        
        const userData = await userResponse.json();
        
        if (!userResponse.ok) {
            console.error('Discord user error:', userData);
            throw new Error('Failed to get user info');
        }
        
        return res.json({
            success: true,
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator || '0',
            avatar: userData.avatar,
            global_name: userData.global_name
        });
        
    } catch (error) {
        console.error('Discord exchange error:', error.message);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to verify Discord account'
        });
    }
}
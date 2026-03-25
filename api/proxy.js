import axios from 'axios';

export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        console.log('Proxy: Forwarding request to bot');
        
        // Forward the request to your bot on Wispbyte
        const botResponse = await axios.post('http://85.215.137.163:3000/api/link', req.body, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Proxy: Bot responded with:', botResponse.data);
        
        // Return the bot's response
        return res.json(botResponse.data);
        
    } catch (error) {
        console.error('Proxy error:', error.message);
        
        return res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to connect to bot'
        });
    }
}
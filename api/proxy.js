import axios from 'axios';

export default async function handler(req, res) {
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
    
    // Use your Cloudflare Tunnel URL (UPDATE THIS WHEN TUNNEL RESTARTS)
    const TUNNEL_URL = 'https://controversy-bench-transcription-eden.trycloudflare.com'; // <-- UPDATE THIS!
    
    try {
        console.log(`Proxy: Forwarding to ${TUNNEL_URL}/api/link`);
        
        const botResponse = await axios.post(`${TUNNEL_URL}/api/link`, req.body, {
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' }
        });
        
        return res.json(botResponse.data);
        
    } catch (error) {
        console.error('Proxy error:', error.message);
        return res.status(500).json({ 
            success: false,
            error: error.message || 'Failed to connect to bot'
        });
    }
}
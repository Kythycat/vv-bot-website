export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ 
        success: true, 
        message: 'API is working!',
        method: req.method,
        env: {
            hasClientId: !!process.env.ROBLOX_CLIENT_ID,
            hasSecret: !!process.env.ROBLOX_CLIENT_SECRET,
            hasWebhook: !!process.env.BOT_WEBHOOK_URL,
            clientIdPrefix: process.env.ROBLOX_CLIENT_ID?.substring(0, 5) + '...'
        }
    });
}
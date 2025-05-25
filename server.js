const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname));

// In-memory storage (in production, use a proper database)
let emailRequests = [];
let downloadStats = [];

// Email configuration (you'll need to configure this with your email provider)
const transporter = nodemailer.createTransport({
    // Gmail configuration example
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
    // For other providers, adjust accordingly
    // host: 'smtp.your-provider.com',
    // port: 587,
    // secure: false,
    // auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    // }
});

// Sample wallpaper data
const wallpapers = [
    {
        id: 1,
        title: "Solitary Oak at Sunset",
        description: "A majestic oak tree standing alone in a golden field during the magical golden hour, with warm sunset colors painting the sky",
        resolution: "4K (3840x2160)",
        category: "Nature",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        downloads: 0
    },
    {
        id: 2,
        title: "Evening Meadow Serenity",
        description: "Peaceful countryside scene with a lone tree silhouetted against a soft pastel evening sky, capturing the tranquil beauty of rural landscapes",
        resolution: "4K (3840x2160)",
        category: "Nature",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        downloads: 0
    },
    {
        id: 3,
        title: "Coastal Grasslands",
        description: "Wild coastal grasses swaying in the breeze with a dreamy, soft-focused background creating an ethereal natural landscape",
        resolution: "4K (3840x2160)",
        category: "Nature",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)",
        downloads: 0
    }
];

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get wallpapers
app.get('/api/wallpapers', (req, res) => {
    res.json(wallpapers);
});

// Handle email request
app.post('/api/request-download', async (req, res) => {
    try {
        const { email, wallpaperId } = req.body;
        
        if (!email || !wallpaperId) {
            return res.status(400).json({ error: 'Email and wallpaper ID are required' });
        }
        
        const wallpaper = wallpapers.find(w => w.id === parseInt(wallpaperId));
        if (!wallpaper) {
            return res.status(404).json({ error: 'Wallpaper not found' });
        }
        
        // Generate unique download token
        const downloadToken = Buffer.from(`${wallpaperId}-${Date.now()}-${Math.random()}`).toString('base64');
        const downloadLink = `${req.protocol}://${req.get('host')}/download.html?id=${wallpaperId}&token=${downloadToken}`;
        
        // Store email request
        const emailRequest = {
            id: Date.now(),
            email,
            wallpaperId: parseInt(wallpaperId),
            wallpaperTitle: wallpaper.title,
            timestamp: new Date().toISOString(),
            downloadLink,
            downloadToken,
            ipAddress: req.ip || req.connection.remoteAddress
        };
        
        emailRequests.push(emailRequest);
        
        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@wallpaperhub.com',
            to: email,
            subject: `Your ${wallpaper.title} Wallpaper Download Link`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .wallpaper-preview { width: 100%; height: 200px; background: ${wallpaper.gradient}; border-radius: 10px; margin: 20px 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
                        .download-btn { display: inline-block; background: linear-gradient(45deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; margin: 20px 0; }
                        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎨 Your Wallpaper is Ready!</h1>
                            <p>Thank you for choosing WallpaperHub</p>
                        </div>
                        <div class="content">
                            <h2>Download: ${wallpaper.title}</h2>
                            <div class="wallpaper-preview">
                                <i>Preview</i>
                            </div>
                            <p><strong>Description:</strong> ${wallpaper.description}</p>
                            <p><strong>Resolution:</strong> ${wallpaper.resolution}</p>
                            <p><strong>Category:</strong> ${wallpaper.category}</p>
                            
                            <p>Click the button below to download your high-quality wallpaper:</p>
                            
                            <a href="${downloadLink}" class="download-btn">📥 Download Wallpaper</a>
                            
                            <p><small>This link will remain active for 30 days. If you have any issues, please contact our support team.</small></p>
                        </div>
                        <div class="footer">
                            <p>© 2024 WallpaperHub. All rights reserved.</p>
                            <p>This email was sent because you requested a wallpaper download from our website.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        // In development, you might want to skip actual email sending
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Email would be sent to:', email);
            console.log('Download link:', downloadLink);
            res.json({ success: true, message: 'Download link generated (development mode)', downloadLink });
        } else {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Download link sent to your email' });
        }
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }
});

// Track download
app.post('/api/track-download', (req, res) => {
    try {
        const { wallpaperId, downloadToken } = req.body;
        
        // Verify the download token
        const emailRequest = emailRequests.find(req => 
            req.wallpaperId === parseInt(wallpaperId) && 
            req.downloadToken === downloadToken
        );
        
        if (!emailRequest) {
            return res.status(400).json({ error: 'Invalid download token' });
        }
        
        // Record the download
        const downloadRecord = {
            id: Date.now(),
            wallpaperId: parseInt(wallpaperId),
            email: emailRequest.email,
            timestamp: new Date().toISOString(),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };
        
        downloadStats.push(downloadRecord);
        
        // Update wallpaper download count
        const wallpaper = wallpapers.find(w => w.id === parseInt(wallpaperId));
        if (wallpaper) {
            wallpaper.downloads++;
        }
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Error tracking download:', error);
        res.status(500).json({ error: 'Failed to track download' });
    }
});

// Admin API endpoints
app.get('/api/admin/stats', (req, res) => {
    // In a real app, you'd verify admin authentication here
    const stats = {
        totalEmailRequests: emailRequests.length,
        totalDownloads: downloadStats.length,
        uniqueEmails: new Set(emailRequests.map(req => req.email)).size,
        wallpaperStats: wallpapers.map(w => ({
            id: w.id,
            title: w.title,
            downloads: w.downloads,
            emailRequests: emailRequests.filter(req => req.wallpaperId === w.id).length
        }))
    };
    
    res.json(stats);
});

app.get('/api/admin/email-requests', (req, res) => {
    // In a real app, you'd verify admin authentication here
    res.json(emailRequests);
});

app.get('/api/admin/download-stats', (req, res) => {
    // In a real app, you'd verify admin authentication here
    res.json(downloadStats);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 WallpaperHub server running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured (development mode)'}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
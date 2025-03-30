require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Environment Configuration
const PORT = process.env.PORT || 3000; // Use Hostinger-allowed port
const TEMP_DIR = path.join(__dirname, 'temp');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Create necessary directories
[TEMP_DIR, PUBLIC_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// API Routes

// 1. Video Downloader Endpoint
app.post('/api/download-video', async (req, res) => {
  try {
    const { url, platform } = req.body;
    
    if (!url || !platform) {
      return res.status(400).json({ 
        success: false, 
        message: 'URL and platform are required' 
      });
    }

    const filename = `video-${uuidv4()}.mp4`;
    const filePath = path.join(TEMP_DIR, filename);

    // Platform-specific handling
    switch (platform) {
      case 'youtube':
        // Implement your YouTube download logic here
        // Note: You may need to use a service like youtube-dl-server
        return res.status(501).json({ 
          success: false, 
          message: 'YouTube download requires additional setup' 
        });

      case 'tiktok':
        // Implement TikTok download logic
        return res.status(501).json({ 
          success: false, 
          message: 'TikTok download requires additional setup' 
        });

      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Unsupported platform' 
        });
    }

  } catch (error) {
    console.error('Video download error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// 2. Background Removal Proxy
app.post('/api/remove-background', async (req, res) => {
  try {
    if (!req.body.imageUrl && !req.body.imageData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image URL or data is required' 
      });
    }

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      req.body.imageUrl 
        ? { image_url: req.body.imageUrl, size: 'auto' }
        : { image_file_b64: req.body.imageData, size: 'auto' },
      {
        headers: {
          'X-Api-Key': process.env.REMOVE_BG_API_KEY
        },
        responseType: 'arraybuffer'
      }
    );
    
    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('Background removal error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to remove background' 
    });
  }
});

// 3. File Download Endpoint
app.get('/api/download/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(TEMP_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    
    res.download(filePath, filename, (err) => {
      if (err) console.error('Download error:', err);
      // Clean up file after download
      setTimeout(() => {
        try { fs.unlinkSync(filePath); } 
        catch (e) { console.error('Cleanup error:', e); }
      }, 30000);
    });
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).send('Internal server error');
  }
});

// 4. Static File Serving
app.use('/public', express.static(PUBLIC_DIR));

// Health Check
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'active', 
    services: ['video-downloader', 'background-removal'] 
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ProTools API running on port ${PORT}`);
  console.log(`Access endpoints at http://yourdomain.com:${PORT}/api/`);
});

// Cleanup old files hourly
setInterval(() => {
  fs.readdir(TEMP_DIR, (err, files) => {
    if (err) return;
    const now = Date.now();
    files.forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > 3600000) {
        fs.unlinkSync(filePath);
      }
    });
  });
}, 3600000);
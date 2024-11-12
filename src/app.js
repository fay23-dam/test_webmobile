const express = require('express');
const { igdl, ttdl, twitter } = require('btch-downloader');
const { twitterdown, fbdown2 } = require("nayan-media-downloader");
const getFBInfo = require("@xaviabot/fb-downloader");
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint to download media based on URL
app.post('/download', async (req, res) => {
    const url = req.query.url;
    console.log(`Received URL: ${url}`);
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        let platform = '';
        let data = [];

        // Detect platform and download media based on URL pattern
        if (url.includes('instagram.com')) {
            data = await igdl(url);
            platform = 'Instagram';
            console.log(data);
            const results = data.map(item => {
              let mediaType = '';
  
              if (item.url.includes("d.rapidcdn.app") || item.url.includes(".mp4") ) {
                  mediaType = 'video';
              } else if (item.url.includes('scontent.cdninstagram.com') || item.url.includes('instagram.fbzv4-1.fna')|| item.url.match(/\.(jpg|jpeg|png|webp)$/i)) {
                  mediaType = 'image';
              } else {
                  mediaType = 'unknown'; // If unable to determine type
              }
  
              return {
                  platform,
                  type: mediaType,
                  url: item.url
              };
          });
          console.log({ platform, data: results });
        res.json({ platform, data: results });
      }else if (url.includes('tiktok.com')) {
        const response = await ttdl(url);
        data = [{ url: response.video[0], type: 'video' }]; // Wrap `url` in an array to match the format of other platforms
        platform = 'TikTok';
        console.log(data);
        console.log({ platform, data });
        res.json({ platform, data });
      }else if (url.includes('facebook.com') || url.includes('fb.watch') || url.match(/fb\.gg/)) {
        console.log('Processing as Facebook URL');
        data = await getFBInfo(url);
        data = [{ url: data.hd, type: 'video' }];
        platform = 'Facebook';
        console.log({ platform, data });
        res.json({ platform, data });
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        data = await twitter(url);
        data = [{ url: data.url[0].hd, type: 'video' }];
        console.log(data);
        platform = 'Twitter';
        console.log({ platform, data });
        res.json({ platform, data });
        } else {
            return res.status(400).json({ error: 'Unsupported platform. URL must be from Instagram, TikTok, Facebook, or Twitter.' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error downloading media', message: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Access it on other devices at http://192.168.0.5:${PORT}`);
});

// index.js
const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Load existing URL mappings from a local file
let urlMappings = {};
try {
    const data = fs.readFileSync('public/urls.json', 'utf8');
    urlMappings = JSON.parse(data);
} catch (error) {
    console.error('Error reading URL mappings:', error);
}

// Endpoint to create short URLs
app.post('/shorten', (req, res) => {
    const originalUrl = req.body.url;
    const shortUrl = shortid.generate();
    urlMappings[shortUrl] = originalUrl;

    // Save updated URL mappings to the file
    fs.writeFileSync('public/urls.json', JSON.stringify(urlMappings), 'utf8');
    res.send({ shortenedUrl: `${req.headers.referer}${shortUrl}` });
});

// Endpoint to redirect to the original URL
app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;
    const originalUrl = urlMappings[shortUrl];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

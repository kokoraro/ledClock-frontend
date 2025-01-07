// Import necessary packages
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

// Initialize Express app
const app = express();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files from 'public' directory
app.use(express.static('public'));

// Route to handle POST requests
app.post('/save', (req, res) => {
    const pixelData = req.body;

    fs.writeFile('pixelData.json', JSON.stringify(pixelData), err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving pixel data');
        } else {
            res.send('Pixel data saved successfully');
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

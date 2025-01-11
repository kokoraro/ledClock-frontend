// Import necessary packages
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Initialize Express app
const app = express();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

app.use(cors({
  origin: '*'
}));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

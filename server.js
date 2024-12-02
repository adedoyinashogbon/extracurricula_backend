const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// Connect to the database and define routes
(async () => {
  const db = await connectToDatabase(); // Connect to MongoDB Atlas

  // Root route
  app.get('/', (req, res) => {
    res.send('Extracurricula Backend is running!');
  });

  // Lessons route
  app.get('/lessons', async (req, res) => {
    try {
      const lessons = await db.collection('lessons').find({}).toArray();
      res.json(lessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();

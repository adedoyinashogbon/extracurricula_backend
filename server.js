const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Setup
const uri = 'mongodb+srv://Austin:Uloma@extracurriculacluster.eqzpu.mongodb.net/?retryWrites=true&w=majority&appName=ExtracurriculaCluster';
const client = new MongoClient(uri);
let db;

client.connect()
  .then(() => {
    db = client.db('extracurricula'); // Database name
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if connection fails
  });

// Routes

// GET /lessons - Fetch all lessons
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await db.collection('lessons').find().toArray();
    res.status(200).json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /orders - Create a new order
app.post('/orders', async (req, res) => {
  console.log('Request body:', req.body); // Debug log
  try {
    const { name, phone, lessonIds } = req.body;

    // Validate the incoming data
    if (!name || !phone || !lessonIds || !lessonIds.length) {
      return res.status(400).send('Missing required fields');
    }

    // Insert the order into the "orders" collection
    const order = { name, phone, lessonIds, createdAt: new Date() };
    const result = await db.collection('orders').insertOne(order);
    console.log('Order inserted:', result.insertedId); // Debug log

    // Update spaces for each lesson
    const updatePromises = lessonIds.map(async (lessonId) => {
      const updateResult = await db.collection('lessons').updateOne(
        { id: parseInt(lessonId) },
        { $inc: { spaces: -1 } }
      );
      console.log(`Updated lesson ID ${lessonId}:`, updateResult); // Debug log
    });
    await Promise.all(updatePromises);

    // Respond with success
    res.status(201).send('Order created successfully');
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Internal Server Error');
  }
});

// PUT /lessons/:id - Update a lesson's attributes
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const updateData = req.body;

    // Validate that there's something to update
    if (!Object.keys(updateData).length) {
      return res.status(400).send('No update data provided');
    }

    const result = await db.collection('lessons').updateOne(
      { id: lessonId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Lesson not found');
    }

    res.status(200).send('Lesson updated successfully');
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb+srv://Austin:Uloma@extracurriculacluster.eqzpu.mongodb.net/extracurricula?retryWrites=true&w=majority';
let db;

MongoClient.connect(uri)
  .then((client) => {
    db = client.db('extracurricula');
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
// Fetch all lessons
app.get('/lessons', async (req, res) => {
  try {
    const lessons = await db.collection('lessons').find().toArray();
    res.status(200).send(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).send({ error: 'Failed to fetch lessons' });
  }
});

// Update lesson spaces
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const { spaces } = req.body;

    const result = await db.collection('lessons').updateOne(
      { id: lessonId },
      { $set: { spaces } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).send({ success: true });
    } else {
      res.status(404).send({ error: 'Lesson not found' });
    }
  } catch (error) {
    console.error('Error updating spaces:', error);
    res.status(500).send({ error: 'Failed to update lesson' });
  }
});

// Create an order
app.post('/orders', async (req, res) => {
  try {
    const { name, phone, lessonIds } = req.body;
    const order = { name, phone, lessonIds, createdAt: new Date() };

    const result = await db.collection('orders').insertOne(order);
    res.status(201).send({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ error: 'Failed to create order' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

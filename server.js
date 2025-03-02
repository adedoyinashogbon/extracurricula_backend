require('dotenv').config(); // ✅ Load environment variables
const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb'); // ✅ Import ObjectId
const logger = require('./middleware/logger');
const connectToDatabase = require('./db');

const app = express();
const PORT = process.env.PORT || 4000; // ✅ Support Render's dynamic port

// ✅ Configure CORS to prevent request blocking
app.use(cors({
  origin: '*', // ✅ Allows requests from any frontend (Change in production)
  methods: ['GET', 'POST', 'PUT'], // ✅ Only required methods
  allowedHeaders: ['Content-Type'], // ✅ Prevent security issues
}));

app.use(express.json());
app.use(logger); // ✅ Custom middleware for logging

// ✅ Static file middleware for serving images
app.use('/icons', express.static('public/icons'));

// ✅ MongoDB Connection
let db;
connectToDatabase()
  .then((database) => {
    db = database;
    console.log('✅ Database connection established.');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// ✅ Default route for Render health check
app.get('/', (req, res) => {
  res.send('🚀 Extracurricula Backend is Running on Render!');
});

// ✅ Fetch all lessons
app.get('/lessons', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    
    const lessons = await db.collection('lessons').find().toArray();
    res.status(200).json(lessons);
  } catch (err) {
    console.error('❌ Error fetching lessons:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// ✅ Update lesson spaces (uses `_id` instead of `id`)
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { spaces } = req.body;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const result = await db.collection('lessons').updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: { spaces } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Lesson not found' });
    }
  } catch (err) {
    console.error('❌ Error updating lesson:', err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// ✅ Create a new order
app.post('/orders', async (req, res) => {
  try {
    const { name, phone, lessonIds } = req.body;
    const order = { name, phone, lessonIds, createdAt: new Date() };

    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }

    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ success: true, orderId: result.insertedId });
  } catch (err) {
    console.error('❌ Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at https://extracurricula-backend.onrender.com`);
});

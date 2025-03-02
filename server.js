require('dotenv').config(); // ✅ Load environment variables
const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb'); // ✅ Import ObjectId
const logger = require('./middleware/logger');
const connectToDatabase = require('./db');

const app = express();
const PORT = process.env.PORT || 4000; // ✅ Support dynamic port for Render

// ✅ Improved CORS setup
app.use(cors({
  origin: [
    'http://localhost:8080',  // ✅ Allow local development
    'https://adedoyinashogbon.github.io' // ✅ Allow GitHub Pages frontend
  ],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(logger); // ✅ Middleware for logging requests

// ✅ Serve static assets like images/icons
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

// ✅ Default route to check if the server is running
app.get('/', (req, res) => {
  res.send('🚀 Extracurricula Backend is Running on Render!');
});

// ✅ Fetch all lessons
app.get('/lessons', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: '❌ Database not connected' });

    const lessons = await db.collection('lessons').find().toArray();
    res.status(200).json(lessons);
  } catch (err) {
    console.error('❌ Error fetching lessons:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// ✅ Fix: Update lesson spaces with proper `_id`
app.put('/lessons/:id', async (req, res) => {
  try {
    const lessonId = req.params.id.trim();
    const { spaces } = req.body;

    // ✅ Validate if lessonId is a valid MongoDB ObjectId
    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: '❌ Invalid lesson ID format' });
    }

    if (!db) {
      return res.status(500).json({ error: '❌ Database not connected' });
    }

    // ✅ Check if lesson exists before updating
    const lesson = await db.collection('lessons').findOne({ _id: new ObjectId(lessonId) });

    if (!lesson) {
      return res.status(404).json({ error: `❌ Lesson with ID ${lessonId} not found` });
    }

    const result = await db.collection('lessons').updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: { spaces } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ success: true, message: `✅ Spaces updated for lesson ${lessonId}` });
    } else {
      res.status(400).json({ error: '❌ No changes made to lesson spaces' });
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
      return res.status(500).json({ error: '❌ Database not connected' });
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

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectToDatabase = require('../db'); // ✅ Ensure correct DB connection

// ✅ Fetch all lessons (with optional search)
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const searchQuery = req.query.q ? req.query.q.trim() : ''; // ✅ Read search param

    let filter = {};
    if (searchQuery) {
      filter = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } }, // ✅ Search in title
          { location: { $regex: searchQuery, $options: 'i' } }, // ✅ Search in location
          { price: { $regex: searchQuery, $options: 'i' } }, // ✅ Search in price
          { spaces: { $regex: searchQuery, $options: 'i' } } // ✅ Search in spaces
        ]
      };
    }

    const lessons = await db.collection('lessons').find(filter).toArray();
    res.status(200).json(lessons);
  } catch (error) {
    console.error('❌ Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// ✅ Update lesson spaces (PUT /lessons/:id)
router.put('/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;

    // ✅ Ensure valid ObjectId
    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    const { spaces } = req.body;

    // ✅ Validate `spaces` input
    if (typeof spaces !== 'number' || spaces < 0) {
      return res.status(400).json({ error: 'Invalid spaces value. Must be a non-negative number.' });
    }

    const db = await connectToDatabase();
    const result = await db.collection('lessons').updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: { spaces } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Lesson not found' });
    }
  } catch (error) {
    console.error(`❌ Error updating spaces for lesson ${lessonId}:`, error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

module.exports = router;

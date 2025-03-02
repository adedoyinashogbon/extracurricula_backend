const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // ✅ Import ObjectId
const connectToDatabase = require('../db'); // ✅ Correct import path

// ✅ Fetch all lessons
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const lessons = await db.collection('lessons').find().toArray();
    res.status(200).json(lessons);
  } catch (error) {
    console.error('❌ Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// ✅ Update lesson spaces (PUT /lessons/:id)
router.put('/:id', async (req, res) => {
  try {
    const lessonId = req.params.id; // ✅ Keep as string

    // ✅ Check if lessonId is a valid ObjectId
    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    const { spaces } = req.body;

    // ✅ Ensure `spaces` is a valid number (prevents empty or string values)
    if (typeof spaces !== 'number' || spaces < 0) {
      return res.status(400).json({ error: 'Invalid spaces value. Must be a positive number.' });
    }

    const db = await connectToDatabase();
    const result = await db.collection('lessons').updateOne(
      { _id: new ObjectId(lessonId) }, // ✅ Use `_id`
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

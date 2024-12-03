const express = require('express');
const router = express.Router();
const connectToDatabase = require('../connectToDatabase');

// Fetch all lessons
router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const lessons = await db.collection('lessons').find().toArray();
    res.status(200).json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

// Update lesson spaces
router.put('/:id', async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id);
    const { spaces } = req.body;

    const db = await connectToDatabase();
    const result = await db.collection('lessons').updateOne(
      { id: lessonId },
      { $set: { spaces } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Lesson not found' });
    }
  } catch (error) {
    console.error('Error updating spaces:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

module.exports = router;

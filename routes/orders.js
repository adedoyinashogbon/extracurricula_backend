const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // ✅ Import ObjectId
const connectToDatabase = require('../db'); // ✅ Correct import path

// ✅ Create a new order with validation
router.post('/', async (req, res) => {
  try {
    const { name, phone, lessonIds } = req.body;

    // ✅ Validate inputs
    if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!phone || !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return res.status(400).json({ error: 'Invalid lesson IDs' });
    }

    const db = await connectToDatabase();

    // ✅ Convert lessonIds to ObjectId format
    const lessonObjectIds = lessonIds.map(id => new ObjectId(id));

    const order = { name, phone, lessonIds: lessonObjectIds, createdAt: new Date() };

    // ✅ Insert order into MongoDB
    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ success: true, orderId: result.insertedId });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;

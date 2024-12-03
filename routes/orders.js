const express = require('express');
const router = express.Router();
const connectToDatabase = require('../connectToDatabase');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { name, phone, lessonIds } = req.body;
    const order = { name, phone, lessonIds, createdAt: new Date() };

    const db = await connectToDatabase();
    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ success: true, orderId: result.insertedId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;

require('dotenv').config(); // ✅ Load environment variables
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // ✅ Get URI from .env
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    return client.db('extracurricula');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectToDatabase;

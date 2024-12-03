const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Austin:Uloma@extracurriculacluster.eqzpu.mongodb.net/extracurricula?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db('extracurricula');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

module.exports = connectToDatabase;

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Austin:Uloma@extracurriculacluster.eqzpu.mongodb.net/?retryWrites=true&w=majority&appName=ExtracurriculaCluster'; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db('extracurricula'); // Replace 'extracurricula' with your database name
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectToDatabase;

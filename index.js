// Log Object Structure
const sampleLog = {
    // ... (log object structure)
    "level": "info",
    "message": "Log message",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  };
  
  const express = require('express');
  const bodyParser = require('body-parser');
  const { MongoClient } = require('mongodb');
  
  const app = express();
  const port = 3000;
  const mongoURI = 'mongodb://localhost:27017'; // Change this to your MongoDB connection string
  const dbName = 'logDB';
  const collectionName = 'logs';
  
  // Use body-parser middleware to parse JSON
  app.use(bodyParser.json());
  
  // Connect to MongoDB
  let db;
  MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  
    // Start the server after connecting to MongoDB
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      // Call the function to execute queries after the server starts
      const { executeSampleQueries } = require('./queryTester');
      executeSampleQueries(db, collectionName);
    });
  });
  
  // Handle incoming log data
  app.post('/logs', async (req, res) => {
    const logData = req.body;
  
    // Check if the request contains valid log data
    if (logData && typeof logData === 'object' && Object.keys(logData).length > 0) {
      // Store logData in MongoDB
      if (db) {
        try {
          const result = await db.collection(collectionName).insertOne(logData);
          console.log('Log data stored in MongoDB:', result.insertedId);
          res.send('Log data received and stored successfully!');
        } catch (error) {
          console.error('Error storing log data in MongoDB:', error);
          res.status(500).send('Internal Server Error');
        }
      } else {
        console.error('MongoDB connection not established');
        res.status(500).send('Internal Server Error');
      }
    } else {
      console.log('Received invalid log data:', req.body);
      res.status(400).send('Invalid log data. Log data not stored.');
    }
  });
  
  // Handle GET request at the root endpoint
  app.get('/', (req, res) => {
    res.send('Server is running!');
  });
  module.exports = { db, collectionName };
  
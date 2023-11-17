const { MongoClient } = require('mongodb');
const { db, collectionName } = require('./index');
const { executeSampleQueries } = require('./queryTester');

// Sample Queries
const sampleQueries = {
  // Find all logs with the level set to "info"
  query1: { level: "info" },

  // Search for logs with the message containing the term "Log message"
  query2: { message: /Log message/i },

  // Retrieve all logs related to resourceId "server-1234"
  query3: { resourceId: "server-1234" },

  // Filter logs between the timestamp "2023-09-10T00:00:00Z" and "2023-09-15T23:59:59Z"
  query4: {
    timestamp: {
      $gte: new Date("2023-09-10T00:00:00Z"),
      $lte: new Date("2023-09-15T23:59:59Z"),
    },
  },

  // ... Add more queries based on your requirements
};

// Execute Sample Queries
(async () => {
  try {
    // Query 1: Find all logs with the level set to "info"
    const result1 = await db.collection(collectionName).find(sampleQueries.query1).toArray();
    console.log("Query 1 Result:", result1);

    // Query 2: Search for logs with the message containing the term "Log message"
    const result2 = await db.collection(collectionName).find(sampleQueries.query2).toArray();
    console.log("Query 2 Result:", result2);

    // Query 3: Retrieve all logs related to resourceId "server-1234"
    const result3 = await db.collection(collectionName).find(sampleQueries.query3).toArray();
    console.log("Query 3 Result:", result3);

    // Query 4: Filter logs between the timestamp "2023-09-10T00:00:00Z" and "2023-09-15T23:59:59Z"
    const result4 = await db.collection(collectionName).find(sampleQueries.query4).toArray();
    console.log("Query 4 Result:", result4);

    await executeSampleQueries(db, collectionName);

    // ... Add more query executions as needed
  } catch (error) {
    console.error("Error executing queries:", error);
  }
})();

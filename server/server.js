const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const { MongoClient, ServerApiVersion } = require('mongodb');
import { Field, ErrorMessage } from 'formik';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// MongoDB connection URI
const uri = "mongodb+srv://safeer:CXGo3LS7VzHxzTu0@supportiyo.pzknu.mongodb.net/?retryWrites=true&w=majority&appName=Supportiyo";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Route to handle data insertion
app.post('/api/insert', async (req, res) => {
  const data = req.body; // Get data from the request body
  console.log("Incoming data:", data); // Log incoming data
  try {
    await client.connect();
    const database = client.db("ClaimReports"); // Use the correct database name
    const collection = database.collection("Client"); // Specify the collection name
    const result = await collection.insertOne(data); // Insert the data
    res.status(201).json({ message: 'Data inserted successfully', id: result.insertedId });
  } catch (error) {
    console.error("Error inserting data:", error); // Log the error
    res.status(500).json({ message: 'Error inserting data', error: error.message }); // Send error message
  } finally {
    await client.close(); // Ensure the client closes after operation
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
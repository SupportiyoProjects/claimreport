const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://safeer:CXGo3LS7VzHxzTu0@supportiyo.pzknu.mongodb.net/?retryWrites=true&w=majority&appName=Supportiyo";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and Collection Names
const DB_NAME = "ClaimReports";
const ADJUSTERS_COLLECTION = "Adjusters";

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection test successful!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if cannot connect to database
  }
}

app.get('/api/Client/count', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("ClaimReports");
    const collection = database.collection("Client");
    
    const count = await collection.find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ count: count.length });
  } catch (error) {
    console.error("Error getting client count:", error);
    res.status(500).json({ error: 'Failed to get client count' });
  } finally {
    await client.close();
  }
});

// Add endpoint for specific email count
app.get('/api/Client/count/:email', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("ClaimReports");
    const collection = database.collection("Client");
    
    const count = await collection.find({
      "email": req.params.email
    }).toArray();

    res.json({ count: count.length });
  } catch (error) {
    console.error("Error getting client count:", error);
    res.status(500).json({ error: 'Failed to get client count' });
  } finally {
    await client.close();
  }
});

// API Endpoints
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

// Create Adjuster
app.post('/api/adjusters', async (req, res) => {
    const { name, email, phone, status, password } = req.body; // Include password
  
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      // Check if adjuster with same email already exists
      const existingAdjuster = await adjustersCollection.findOne({ email });
      if (existingAdjuster) {
        return res.status(400).json({ error: 'An adjuster with this email already exists' });
      }
  
      const newAdjuster = {
        name,
        email,
        phone,
        status: status || 'active', // Default to active if not specified
        password, // Add password to the new adjuster
        progress: 'Initial', // Set progress to 'Initial'
        createdAt: new Date(),
        updatedAt: new Date()
      };
  
      const result = await adjustersCollection.insertOne(newAdjuster);
      res.status(201).json({
        message: 'Adjuster created successfully!',
        id: result.insertedId,
        adjuster: newAdjuster
      });
    } catch (error) {
      console.error("Error creating adjuster:", error);
      res.status(500).json({ error: 'Failed to create adjuster' });
    }
  });

// Get all adjusters
app.get('/api/adjusters', async (req, res) => {
  try {
    const database = client.db(DB_NAME);
    const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
    
    const adjusters = await adjustersCollection.find({})
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .toArray();

    res.json(adjusters);
  } catch (error) {
    console.error("Error fetching adjusters:", error);
    res.status(500).json({ error: 'Failed to fetch adjusters' });
  }
});

// Get single adjuster by ID
app.get('/api/adjusters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db(DB_NAME);
    const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
    
    const adjuster = await adjustersCollection.findOne({ _id: new ObjectId(id) });
    
    if (!adjuster) {
      return res.status(404).json({ error: 'Adjuster not found' });
    }

    res.json(adjuster);
  } catch (error) {
    console.error("Error fetching adjuster:", error);
    res.status(500).json({ error: 'Failed to fetch adjuster' });
  }
});

// Update adjuster status
app.patch('/api/adjusters/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const database = client.db(DB_NAME);
    const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
    
    const result = await adjustersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Adjuster not found' });
    }
    
    res.json({ 
      message: 'Status updated successfully',
      status: status
    });
  } catch (error) {
    console.error("Error updating adjuster status:", error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Update adjuster details
app.put('/api/adjusters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const database = client.db(DB_NAME);
    const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);

    // Check if email is being changed and if it conflicts with another adjuster
    const existingAdjuster = await adjustersCollection.findOne({
      email,
      _id: { $ne: new ObjectId(id) }
    });

    if (existingAdjuster) {
      return res.status(400).json({ error: 'An adjuster with this email already exists' });
    }

    const result = await adjustersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          email,
          phone,
          status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Adjuster not found' });
    }

    res.json({ message: 'Adjuster updated successfully' });
  } catch (error) {
    console.error("Error updating adjuster:", error);
    res.status(500).json({ error: 'Failed to update adjuster' });
  }
});

// Delete adjuster
app.delete('/api/adjusters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db(DB_NAME);
    const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
    
    const result = await adjustersCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Adjuster not found' });
    }

    res.json({ message: 'Adjuster deleted successfully' });
  } catch (error) {
    console.error("Error deleting adjuster:", error);
    res.status(500).json({ error: 'Failed to delete adjuster' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
  connectToDatabase();
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
}); 

// Fetch all clients
// Add this with your other endpoints
app.get('/api/client', async (req, res) => {
    try {
      const database = client.db(DB_NAME);
      const clientsCollection = database.collection("Client");
      
      const clients = await clientsCollection.find({}).toArray();
      res.json(clients);

    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  });
  
  // Add this with your other endpoints
app.put('/api/adjusters/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      const result = await adjustersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { 
          status,
          updatedAt: new Date()
        }}
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Adjuster not found' });
      }
  
      res.json({ message: 'Adjuster status updated successfully' });
    } catch (error) {
      console.error("Error updating adjuster status:", error);
      res.status(500).json({ error: 'Failed to update adjuster status' });
    }
  });


  app.get('/api/adjusters/:id/tasks', async (req, res) => {
    const { id } = req.params; // Get the adjuster ID from the URL parameters
    try {
      const database = client.db(DB_NAME);
      const tasksCollection = database.collection('Tasks');
  
      const tasks = await tasksCollection.find({ assignedTo: new ObjectId(id) }).toArray(); // Fetch tasks assigned to the adjuster
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks for adjuster:", error);
      res.status(500).json({ error: 'Failed to fetch tasks for adjuster' });
    }
  });
  app.patch('/api/clients/:id/assign', async (req, res) => {
    const { id } = req.params; // Get the client ID from the URL parameters
    const { adjusterId } = req.body; // Get the adjuster ID from the request body
  
    try {
      const database = client.db(DB_NAME);
      const clientsCollection = database.collection("Client");
      
      const result = await clientsCollection.updateOne(
        { _id: new ObjectId(id) }, // Find the client by ID
        { $set: { assignedTo: adjusterId } } // Update the assignedTo field
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      res.json({ message: 'Adjuster assigned successfully' });
    } catch (error) {
      console.error("Error assigning adjuster:", error);
      res.status(500).json({ error: 'Failed to assign adjuster' });
    }
  });


  app.get('/api/clients/with-adjusters', async (req, res) => {
    try {
      const database = client.db(DB_NAME);
      const clientsCollection = database.collection("Client");
      const adjustersCollection = database.collection("Adjusters");
  
      const clients = await clientsCollection.aggregate([
        {
          $lookup: {
            from: 'adjusters', // The name of the adjusters collection
            localField: 'assignedTo',
            foreignField: '_id',
            as: 'adjusterDetails'
          }
        },
        {
          $unwind: {
            path: '$adjusterDetails',
            preserveNullAndEmptyArrays: true // Keep clients without assigned adjusters
          }
        }
      ]).toArray();
  
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients with adjusters:", error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  });


  // Add this endpoint to validate adjuster login
app.post('/api/adjusters/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      const adjuster = await adjustersCollection.findOne({ email, password });
  
      if (!adjuster) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      res.status(200).json({ message: 'Login successful', adjuster });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Add this endpoint to assign an adjuster to a client
app.patch('/api/clients/:clientId/assign', async (req, res) => {
    const { clientId } = req.params;
    const { adjusterId } = req.body;
  
    if (!adjusterId) {
      return res.status(400).json({ error: 'Adjuster ID is required' });
    }
  
    try {
      const database = client.db(DB_NAME);
      const clientsCollection = database.collection('clients');
  
      // Update the client with the assigned adjuster
      const result = await clientsCollection.updateOne(
        { _id: new ObjectId(clientId) },
        { $set: { assignedTo: new ObjectId(adjusterId) } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      res.status(200).json({ message: 'Adjuster assigned to client successfully' });
    } catch (error) {
      console.error("Error assigning adjuster to client:", error);
      res.status(500).json({ error: 'Failed to assign adjuster to client' });
    }
  });


  // Update client with assigned adjuster
app.patch('/api/clients/:id/assign', async (req, res) => {
    const { id } = req.params;
    const { adjusterId } = req.body;
  
    try {
      const database = client.db(DB_NAME);
      const clientsCollection = database.collection('clients');
  
      const result = await clientsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { assignedTo: new ObjectId(adjusterId) } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      res.json({ message: 'Client updated successfully' });
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: 'Failed to update client' });
    }
  });
  
  // Update adjuster with client data
  // Add this endpoint to update adjuster with client data
  app.patch('/api/adjusters/:id/clients', async (req, res) => {
    const { id } = req.params;
    const { clientData } = req.body;
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      // Store the complete client data instead of just the reference
      const result = await adjustersCollection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $addToSet: { 
            clients: {
              ...clientData,
              _id: new ObjectId(clientData._id) // Ensure proper ObjectId format
            }
          }
        }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Adjuster not found' });
      }
  
      res.json({ 
        message: 'Adjuster updated successfully with client data',
        updatedClient: clientData 
      });
    } catch (error) {
      console.error("Error updating adjuster with client data:", error);
      res.status(500).json({ error: 'Failed to update adjuster with client data' });
    }
  });


  // Remove specific client from adjuster's list
app.patch('/api/adjusters/:adjusterId/removeClient/:clientId', async (req, res) => {
    const { adjusterId, clientId } = req.params;
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      const result = await adjustersCollection.updateOne(
        { _id: new ObjectId(adjusterId) },
        { 
          $pull: { 
            clients: { _id: new ObjectId(clientId) }
          }
        }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Adjuster not found' });
      }
  
      res.json({ message: 'Client removed from adjuster successfully' });
    } catch (error) {
      console.error("Error removing client from adjuster:", error);
      res.status(500).json({ error: 'Failed to remove client from adjuster' });
    }
  });
  
  // Update or add client to adjuster's list
  app.patch('/api/adjusters/:adjusterId/updateClient', async (req, res) => {
    const { adjusterId } = req.params;
    const { clientData } = req.body;
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      // First try to update existing client data
      const updateResult = await adjustersCollection.updateOne(
        { 
          _id: new ObjectId(adjusterId),
          'clients._id': new ObjectId(clientData._id)
        },
        { 
          $set: { 
            'clients.$': {
              ...clientData,
              _id: new ObjectId(clientData._id)
            }
          }
        }
      );
  
      // If client wasn't found in the list, add it as a new entry
      if (updateResult.matchedCount === 0) {
        const addResult = await adjustersCollection.updateOne(
          { _id: new ObjectId(adjusterId) },
          { 
            $addToSet: { 
              clients: {
                ...clientData,
                _id: new ObjectId(clientData._id)
              }
            }
          }
        );
  
        if (addResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Adjuster not found' });
        }
      }
  
      res.json({ 
        message: 'Adjuster updated successfully with client data',
        updatedClient: clientData 
      });
    } catch (error) {
      console.error("Error updating adjuster with client data:", error);
      res.status(500).json({ error: 'Failed to update adjuster with client data' });
    }
  });


  app.get('/api/adjusters/me/clients', async (req, res) => {
    const adjusterId = req.user.id; // Assuming you have user authentication and can get the adjuster ID
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      const adjuster = await adjustersCollection.findOne({ _id: new ObjectId(adjusterId) });
      if (!adjuster) {
        return res.status(404).json({ error: 'Adjuster not found' });
      }
  
      const clients = adjuster.clients; // Assuming clients are stored in the adjuster document
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients for adjuster:", error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  });

  // Get adjuster's own data including their clients
app.get('/api/adjusters/me', async (req, res) => {
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
      
      // In a real application, you would get the adjuster ID from the authenticated session
      // For now, we'll use the email as an example
      const adjuster = await adjustersCollection.findOne({ 
        email: "user1@gmail.com" // Replace this with actual authentication
      });
  
      if (!adjuster) {
        return res.status(404).json({ error: 'Adjuster not found' });
      }
  
      res.json(adjuster);
    } catch (error) {
      console.error("Error fetching adjuster data:", error);
      res.status(500).json({ error: 'Failed to fetch adjuster data' });
    }
  });


  // Get adjuster data by ID
app.get('/api/adjusters/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
      
      const adjuster = await adjustersCollection.findOne({ 
        _id: new ObjectId(id)
      });
  
      if (!adjuster) {
        return res.status(404).json({ error: 'Adjuster not found' });
      }
  
      res.json(adjuster);
    } catch (error) {
      console.error("Error fetching adjuster data:", error);
      res.status(500).json({ error: 'Failed to fetch adjuster data' });
    }
  });
  
// Login endpoint
app.post('/api/adjusters/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Fetch the adjuster with the provided email and password
      const adjuster = await Adjuster.findOne({ email, password });
  
      if (!adjuster) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Log the adjuster's ID to the console
      console.log('Adjuster ID:', adjuster._id); // This should log the ID
  
      // Return the adjuster data including the ID
      res.json({
        _id: adjuster._id, // Ensure this is included
        name: adjuster.name,
        email: adjuster.email,
        clients: adjuster.clients, // Include clients if needed
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: 'Login failed' });
    }
  });


  // Adjuster endpoint to fetch clients
app.post('/api/adjusters', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const adjuster = await Adjuster.findOne({ email, password }).populate('clients');
  
      if (!adjuster) {
        return res.status(404).json({ error: 'Adjuster not found' });
      }
  
      res.json({
        _id: adjuster._id,
        name: adjuster.name,
        email: adjuster.email,
        clients: adjuster.clients, // Include clients in the response
      });
    } catch (error) {
      console.error("Error fetching adjuster data:", error);
      res.status(500).json({ error: 'Failed to fetch adjuster data' });
    }
  });

  // Example Express.js route
app.put('/clients/:id/progress', async (req, res) => {
    const { id } = req.params;
    const { progress } = req.body;
  
    try {
      await Client.updateOne({ _id: id }, { progress });
      res.status(200).send({ message: 'Progress updated successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error updating progress', error });
    }
  });

  app.put('/api/clients/:clientId/progress', async (req, res) => {
    const { clientId } = req.params;
    const { progress } = req.body;
  
    try {
      const database = client.db(DB_NAME);
      const clientsCollection = database.collection('clients');
  
      const result = await clientsCollection.updateOne(
        { _id: new ObjectId(clientId) },
        { $set: { progress } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
  
      res.json({ message: 'Progress updated successfully' });
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  // Update client progress within adjuster's document
app.put('/api/adjusters/clients/:clientId/progress', async (req, res) => {
    const { clientId } = req.params;
    const { progress, adjusterId } = req.body;
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      const result = await adjustersCollection.updateOne(
        { 
          _id: new ObjectId(adjusterId),
          'clients._id': new ObjectId(clientId)
        },
        { 
          $set: { 
            'clients.$.insured.progress': progress
          }
        }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Client or Adjuster not found' });
      }
  
      res.json({ 
        message: 'Progress updated successfully',
        progress 
      });
    } catch (error) {
      console.error("Error updating client progress:", error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  // Add this endpoint to update client progress
app.patch('/api/adjusters/:adjusterId/clients/:clientId/progress', async (req, res) => {
    const { adjusterId, clientId } = req.params;
    const { progress } = req.body;
  
    try {
      const database = client.db(DB_NAME);
      const adjustersCollection = database.collection(ADJUSTERS_COLLECTION);
  
      console.log('Updating progress:', { adjusterId, clientId, progress });
  
      const result = await adjustersCollection.updateOne(
        { 
          _id: new ObjectId(adjusterId),
          'clients._id': new ObjectId(clientId)
        },
        { 
          $set: { 
            'clients.$.insured.progress': progress
          }
        }
      );
  
      if (result.matchedCount === 0) {
        console.log('No matching document found');
        return res.status(404).json({ 
          error: 'Client or Adjuster not found',
          details: { adjusterId, clientId, progress }
        });
      }
  
      if (result.modifiedCount === 0) {
        console.log('Document matched but not modified');
        return res.status(400).json({ 
          error: 'No changes made',
          details: { adjusterId, clientId, progress }
        });
      }
  
      console.log('Update successful:', result);
      res.json({ 
        message: 'Progress updated successfully',
        progress,
        modifiedCount: result.modifiedCount
      });
  
    } catch (error) {
      console.error("Error updating client progress:", error);
      res.status(500).json({ 
        error: 'Failed to update progress',
        details: error.message
      });
    }
  });
// app.get('/api/Client/count/:email', async (req, res) => {
//   try {
//     await client.connect();
//     const database = client.db("ClaimReports");
//     const collection = database.collection("Client");
    
//     const count = await collection.countDocuments({
//       "insured.email": req.params.email
//     });
//     res.json({ count });
//   } catch (error) {
//     console.error("Error getting client count:", error);
//     res.status(500).json({ error: 'Failed to get client count' });
//   } finally {
//     await client.close();
//   }
// });


app.patch('/api/adjusters/:adjusterId/clients/:clientId/completion-date', async (req, res) => {
    const { adjusterId, clientId } = req.params;
    const { completionDate } = req.body;
  
    try {
      // Ensure completionDate is a valid date
      const date = new Date(completionDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
  
      const result = await adjustersCollection.updateOne(
        { _id: new ObjectId(adjusterId), 'clients._id': new ObjectId(clientId) },
        { $set: { 'clients.$.completionDate': date } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Adjuster or Client not found' });
      }
  
      res.json({ message: 'Completion date updated successfully' });
    } catch (error) {
      console.error("Error updating completion date:", error);
      res.status(500).json({ error: 'Failed to update completion date' });
    }
  });
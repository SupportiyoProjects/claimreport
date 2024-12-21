import axios from 'axios'; // Make sure to install axios

 async function insertClientData(data) {
  try {
    console.log('Data being sent:', data); // Log the data being sent
    const response = await axios.post('http://localhost:5000/api/insert', data); // Send data to the server
    console.log(response.data.message); // Log success message
  } catch (error) {
    console.error("Error inserting data:", error.response ? error.response.data : error.message);
  }
}

export default insertClientData; // Export the function
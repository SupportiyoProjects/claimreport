import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Existing Adjuster APIs
export const getAdjusters = () => api.get("/adjusters");
export const createAdjuster = (data) => api.post("/adjusters", data);
export const updateAdjuster = (id, data) => api.put(`/adjusters/${id}`, data);
export const deleteAdjuster = (id) => api.delete(`/adjusters/${id}`);

// Client APIs
export const getClients = () => api.get("/client");

// Task APIs
export const getTasks = (status) => api.get(`/tasks?status=${status}`); // Adjust the endpoint as necessary

export default api;

// Update Adjuster Status
export const updateAdjusterStatus = (id, status) =>
  api.put(`/adjusters/${id}/status`, { status });

// Allocated Tasks API
export const getAllocatedTasks = () => api.get("/allocated-tasks");
// export const assignAdjusterToClient = (clientId, adjusterId) => {
//     return fetch(`http://localhost:5000/api/clients/${clientId}/assign`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ adjusterId }),
//     });
//   };

export const getClientsWithAdjusters = () => {
  return fetch("http://localhost:5000/api/clients/with-adjusters").then(
    (response) => response.json()
  );
};

// Add these to your existing api.js file
export const assignAdjusterToClient = (clientId, adjusterId) => {
  return api.patch(`/clients/${clientId}/assign`, { adjusterId });
};

export const updateAdjusterWithClientData = (adjusterId, clientData) => {
  return api.patch(`/adjusters/${adjusterId}/clients`, { clientData });
};

export const getClientsForAdjuster = async () => {
  const response = await fetch(
    "http://localhost:5000/api/adjusters/me/clients",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Include any necessary authentication headers here
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  return response.json();
};

// Add this to your existing api.js file


// Add this to your existing api.js file
export const updateClientProgress = (adjusterId, clientId, progress) => {
  return api.patch(
    `/api/adjusters/${adjusterId}/clients/${clientId}/progress`,
    { progress }
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdjusterDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adjusterData, setAdjusterData] = useState(location.state.adjuster || null);
  const [loading, setLoading] = useState(!adjusterData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!adjusterData) {
      const storedAdjuster = localStorage.getItem('adjusterData');
      if (!storedAdjuster) {
        navigate('/'); // Redirect to login if no stored data
        return;
      }

      const data = JSON.parse(storedAdjuster);
      setAdjusterData(data); // Set the adjuster data including clients
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [adjusterData, navigate]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!adjusterData) return <div className="p-4">No data found</div>;

  // Log the adjuster data to inspect its structure
  console.log('Adjuster Data:', adjusterData);

  // Access clients from adjusterData
  const clients = Array.isArray(adjusterData.clients) ? adjusterData.clients : []; // Default to an empty array if clients is not an array

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold">Welcome, {adjusterData.name}</h1>
      <p>Your assigned clients are listed below:</p>
      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type of Loss</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier Email</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {client.insured.insuredFirstName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.insured.insuredLastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.insured.street}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.insured.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.claim.typeOfLoss}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {client.claim.carrierEmail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdjusterDashboard; 
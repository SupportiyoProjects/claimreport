import React, { useState, useEffect } from 'react';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [inactiveAdjusters, setInactiveAdjusters] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAdjuster, setSelectedAdjuster] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClients();
    fetchInactiveAdjusters();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError('Failed to fetch clients');
    }
  };

  const fetchInactiveAdjusters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/adjusters/inactive');
      const data = await response.json();
      setInactiveAdjusters(data);
    } catch (err) {
      setError('Failed to fetch adjusters');
    }
  };

  const handleAssignAdjuster = async () => {
    if (!selectedClient || !selectedAdjuster) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/Client/${selectedClient}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adjusterId: selectedAdjuster }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to assign adjuster');
      }
  
      // Refresh the client list or handle success
      fetchClients();
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Client List</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm text-center">
          {success}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Number
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date of Loss
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assign Adjuster
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{client.location}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{client.clientNumber}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{new Date(client.dateOfLoss).toLocaleDateString()}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => {
                      setSelectedClient(client._id);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Select Adjuster</h3>
                <ul className="space-y-2">
                  {inactiveAdjusters.map((adjuster) => (
                    <li key={adjuster._id}>
                      <button
                        onClick={() => {
                          setSelectedAdjuster(adjuster._id);
                          handleAssignAdjuster();
                        }}
                        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                      >
                        {adjuster.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList; 
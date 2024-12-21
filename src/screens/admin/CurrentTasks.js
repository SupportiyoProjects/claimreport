import React, { useState, useEffect } from 'react';
import { getClients, getAdjusters } from '../../services/api';
import Loader from '../../components/Loader';

const CurrentTasks = () => {
  const [clients, setClients] = useState([]);
  const [adjusters, setAdjusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsResponse = await getClients();
        const adjustersResponse = await getAdjusters();
        setClients(clientsResponse.data || []);
        setAdjusters(adjustersResponse.data || []);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

//   const handleAdjusterSelect = async (clientId, adjusterId) => {
//     try {
//       const clientData = clients.find(client => client._id === clientId);
//       const previousAdjusterId = clientData.assignedTo;
  
//       // Create complete client data object
//       const completeClientData = {
//         _id: clientId,
//         insured: clientData.insured,
//         claimNumber: clientData.claimNumber,
//         policyNumber: clientData.policyNumber,
//         dateOfLoss: clientData.dateOfLoss,
//         typeOfLoss: clientData.typeOfLoss,
//         status: clientData.status,
//       };
  
//       // If there was a previous adjuster and it's different from the new one
//       if (previousAdjusterId && previousAdjusterId !== adjusterId) {
//         // Remove client from previous adjuster's list
//         const removeResponse = await fetch(`http://localhost:5000/api/adjusters/${previousAdjusterId}/removeClient/${clientId}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         });
  
//         if (!removeResponse.ok) {
//           throw new Error('Failed to remove client from previous adjuster');
//         }
//       }
  
//       // Update client's assigned adjuster
//       const assignResponse = await fetch(`http://localhost:5000/api/clients/${clientId}/assign`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ adjusterId }),
//       });
  
//       if (!assignResponse.ok) {
//         throw new Error('Failed to assign adjuster to client');
//       }
  
//       // Update or add client to new adjuster's list
//       const updateAdjusterResponse = await fetch(`http://localhost:5000/api/adjusters/${adjusterId}/updateClient`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           clientData: completeClientData
//         }),
//       });
  
//       if (!updateAdjusterResponse.ok) {
//         throw new Error('Failed to update adjuster with client data');
//       }
  
//       // Update local state
//       setClients(prevClients => 
//         prevClients.map(client => 
//           client._id === clientId ? { ...client, assignedTo: adjusterId } : client
//         )
//       );
//     } catch (error) {
//       setError('Failed to assign adjuster and update data');
//       console.error('Error:', error);
//     }
//   };

const handleAdjusterSelect = async (clientId, adjusterId) => {
    try {
      const clientData = clients.find(client => client._id === clientId);
      const previousAdjusterId = clientData.assignedTo;
  
      // Create complete client data object
      const completeClientData = {
        _id: clientId,
        insured: clientData.insured,
        claim: clientData.claim, // Add claim data here
        // Include any other necessary fields from clientData
      };
  
      // If there was a previous adjuster and it's different from the new one
      if (previousAdjusterId && previousAdjusterId !== adjusterId) {
        // Remove client from previous adjuster's list
        const removeResponse = await fetch(`http://localhost:5000/api/adjusters/${previousAdjusterId}/removeClient/${clientId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (!removeResponse.ok) {
          throw new Error('Failed to remove client from previous adjuster');
        }
      }
  
      // Update client's assigned adjuster
      const assignResponse = await fetch(`http://localhost:5000/api/clients/${clientId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adjusterId }),
      });
  
      if (!assignResponse.ok) {
        throw new Error('Failed to assign adjuster to client');
      }
  
      // Update or add client to new adjuster's list
      const updateAdjusterResponse = await fetch(`http://localhost:5000/api/adjusters/${adjusterId}/updateClient`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          clientData: completeClientData // Send complete client data including claim
        }),
      });
  
      if (!updateAdjusterResponse.ok) {
        throw new Error('Failed to update adjuster with client data');
      }
  
      // Update local state
      setClients(prevClients => 
        prevClients.map(client => 
          client._id === clientId ? { ...client, assignedTo: adjusterId } : client
        )
      );
    } catch (error) {
      setError('Failed to assign adjuster and update data');
      console.error('Error:', error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Current Tasks</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insured Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map(client => {
              const adjuster = adjusters.find(adj => adj._id === client.assignedTo);
              const insured = client.insured || {};
              return (
                <tr key={client._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {insured.insuredFirstName} {insured.insuredLastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {insured.street}, {insured.city}, {insured.state} {insured.zipCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {insured.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      onChange={(e) => handleAdjusterSelect(client._id, e.target.value)}
                      value={client.assignedTo || ''}
                    >
                      <option value="">Select an adjuster</option>
                      {adjusters.map(adjuster => (
                        <option key={adjuster._id} value={adjuster._id}>
                          {adjuster.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentTasks; 
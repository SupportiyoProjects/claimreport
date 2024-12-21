import React, { useState, useEffect } from 'react';
import { getClients, getAdjusters } from '../../services/api';
import Loader from '../../components/Loader';

const AllocateTasks = () => {
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

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Allocate Tasks</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Adjuster</th>
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
                    {adjuster ? adjuster.name : 'No Adjuster Assigned'}
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

export default AllocateTasks;
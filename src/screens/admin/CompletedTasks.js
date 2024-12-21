import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUser } from 'react-icons/fa';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/adjusters');
      const adjusters = await response.json();

      // Flatten all clients from all adjusters and filter for "Third" progress
      const allCompletedTasks = adjusters.flatMap(adjuster => 
        adjuster.clients
          .filter(client => client.insured.progress === "Third")
          .map(client => ({
            ...client,
            adjusterName: adjuster.name,
            adjusterEmail: adjuster.email
          }))
      );

      setCompletedTasks(allCompletedTasks);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching completed tasks:', err);
      setError('Failed to fetch completed tasks');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <FaSpinner className="animate-spin text-4xl text-indigo-600" />
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Completed Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completedTasks.map((task) => (
          <div key={task._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FaUser className="text-indigo-600 w-4 h-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">
                      {task.insured.insuredFirstName} {task.insured.insuredLastName}
                    </h3>
                    <p className="text-sm text-gray-500">{task.claim.typeOfLoss}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Assigned To:</span> {task.adjusterName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Claim Number:</span> {task.claim.claimNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {task.insured.street}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">City:</span> {task.insured.city}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Contact:</span> {task.insured.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date of Loss:</span> {task.claim.dateOfLoss}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedTasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FaUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Completed Tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no clients with completed tasks at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletedTasks; 
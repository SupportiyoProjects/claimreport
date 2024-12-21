import React, { useState, useEffect } from 'react';

const AdjustersList = () => {
  const [adjusters, setAdjusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchAdjusters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/adjusters');
      if (!response.ok) throw new Error('Failed to fetch adjusters');
      const data = await response.json();
      setAdjusters(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    setUpdatingStatus(id);
    try {
      const response = await fetch(`http://localhost:5000/api/adjusters/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: currentStatus === 'active' ? 'inactive' : 'active'
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      setAdjusters(adjusters.map(adjuster => 
        adjuster._id === id 
          ? { ...adjuster, status: currentStatus === 'active' ? 'inactive' : 'active' }
          : adjuster
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchAdjusters();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Adjusters List</h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adjusters.map((adjuster) => (
                <tr 
                  key={adjuster._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {adjuster.name}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">
                      {adjuster.email}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-500">
                      {adjuster.phone}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(adjuster._id, adjuster.status)}
                        disabled={updatingStatus === adjuster._id}
                        className={`
                          inline-flex items-center justify-center px-3 sm:px-4 py-1 sm:py-2
                          rounded-full text-xs sm:text-sm font-medium min-w-[100px] sm:min-w-[120px]
                          transition-all duration-200 ease-in-out
                          ${adjuster.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } 
                          ${updatingStatus === adjuster._id ? 'opacity-75 cursor-not-allowed' : 'transform hover:scale-105'}
                        `}
                      >
                        {updatingStatus === adjuster._id ? (
                          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                            <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <span className="capitalize">{adjuster.status}</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {adjusters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No adjusters found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdjustersList; 
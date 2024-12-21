import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSpinner, FaPhone, FaEnvelope } from 'react-icons/fa';
import { MdLocationOn, MdDescription } from 'react-icons/md';
import { BsCalendarDate } from 'react-icons/bs';

const AdjusterDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adjusterData, setAdjusterData] = useState(location.state?.adjuster || null);
  const [loading, setLoading] = useState(!adjusterData);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'inProgress', 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!adjusterData) {
      const storedAdjuster = localStorage.getItem('adjusterData');
      if (!storedAdjuster) {
        navigate('/');
        return;
      }

      try {
        const data = JSON.parse(storedAdjuster);
        setAdjusterData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error parsing stored adjuster data:', err);
        setError('Invalid stored data');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [adjusterData, navigate]);

  const handleProgressChange = async (clientId, newProgress) => {
    try {
      const response = await fetch(`http://localhost:5000/api/adjusters/${adjusterData._id}/clients/${clientId}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress: newProgress }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAdjusterData(prevData => ({
        ...prevData,
        clients: prevData.clients.map(client => 
          client._id === clientId 
            ? {...client, insured: {...client.insured, progress: newProgress}}
            : client
        )
      }));

    } catch (error) {
      console.error("Error updating progress:", error);
      setError("Failed to update progress.");
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

  const clients = Array.isArray(adjusterData.clients) ? adjusterData.clients : [];

  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.insured.insuredFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.insured.insuredLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'inProgress' ? client.insured.progress !== 'Third' :
      activeTab === 'completed' ? client.insured.progress === 'Third' :
      true;

    return matchesSearch && matchesTab;
  });

  const getProgressColor = (progress) => {
    switch(progress) {
      case 'First':
        return 'bg-yellow-100 text-yellow-800';
      case 'Second':
        return 'bg-blue-100 text-blue-800';
      case 'Third':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {adjusterData.name}</h1>
            <p className="text-gray-600 mt-1">Manage your assigned cases</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-indigo-600">Total Cases: {clients.length}</p>
            </div>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-2">
        <div className="flex space-x-4">
          {[
            { id: 'all', label: 'All Cases' },
            { id: 'inProgress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              {/* Client Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FaUser className="text-indigo-600 w-4 h-4" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800">
                      {client.insured.insuredFirstName} {client.insured.insuredLastName}
                    </h3>
                    <p className="text-sm text-gray-500">{client.claim.typeOfLoss}</p>
                  </div>
                </div>
                <select
                  onChange={(e) => handleProgressChange(client._id, e.target.value)}
                  value={client.insured.progress || "Select Progress"}
                  className="text-sm border rounded-md p-1.5 bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Select Progress" disabled>Select Progress</option>
                  <option value="First">First Stage</option>
                  <option value="Second">Second Stage</option>
                  <option value="Third">Final Stage</option>
                </select>
              </div>

              {/* Client Details */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MdLocationOn className="w-4 h-4 mr-2" />
                  <span className="text-sm truncate">{client.insured.street}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{client.insured.primaryPhone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="w-4 h-4 mr-2" />
                  <span className="text-sm truncate">{client.insured.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BsCalendarDate className="w-4 h-4 mr-2" />
                  <span className="text-sm">Claim #: {client.claim.claimNumber}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MdDescription className="w-4 h-4 mr-2" />
                  <span className="text-sm truncate">{client.claim.lossDescription}</span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getProgressColor(client.insured.progress)}`}>
                    {client.insured.progress || 'Not Started'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FaUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Clients Found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'No clients available in this category'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdjusterDashboard; 
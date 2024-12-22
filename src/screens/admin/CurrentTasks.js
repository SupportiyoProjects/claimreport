import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Modal from '../../components/Modal';
import 'react-calendar/dist/Calendar.css';
import { FaUser } from 'react-icons/fa';

const CurrentTasks = () => {
  const [clients, setClients] = useState([]);
  const [adjusters, setAdjusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAdjuster, setSelectedAdjuster] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [scheduledDates, setScheduledDates] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (adjusters.length > 0) {
      const dates = adjusters.flatMap(adjuster => 
        adjuster.clients
          .filter(client => client.scheduledDate)
          .map(client => new Date(client.scheduledDate))
      );
      setScheduledDates(dates);
    }
  }, [adjusters]);

  const fetchData = async () => {
    try {
      const [clientsResponse, adjustersResponse] = await Promise.all([
        fetch('http://localhost:5000/api/clients'),
        fetch('http://localhost:5000/api/adjusters')
      ]);

      const clientsData = await clientsResponse.json();
      const adjustersData = await adjustersResponse.json();

      setClients(clientsData);
      setAdjusters(adjustersData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleAdjusterSelect = async (clientId, adjusterId) => {
    try {
      const clientData = clients.find(client => client._id === clientId);
      const previousAdjusterId = clientData.assignedTo;

      if (previousAdjusterId && previousAdjusterId !== adjusterId) {
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

      const assignResponse = await fetch(`http://localhost:5000/api/clients/${clientId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adjusterId }),
      });

      if (!assignResponse.ok) {
        throw new Error('Failed to assign client to adjuster');
      }

      // Update local state
      setClients(prevClients =>
        prevClients.map(client =>
          client._id === clientId
            ? { ...client, assignedTo: adjusterId }
            : client
        )
      );

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowClientModal(true);
    setShowCalendarModal(false);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowClientModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmSchedule = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/adjusters/${selectedClient.assignedTo}/clients/${selectedClient._id}/schedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledDate: selectedDate
        }),
      });

      if (!response.ok) throw new Error('Failed to schedule date');

      // Update local state
      setAdjusters(adjusters.map(adjuster => {
        if (adjuster._id === selectedClient.assignedTo) {
          return {
            ...adjuster,
            clients: adjuster.clients.map(client => {
              if (client._id === selectedClient._id) {
                return { ...client, scheduledDate: selectedDate };
              }
              return client;
            })
          };
        }
        return adjuster;
      }));

      setShowConfirmModal(false);
      setSelectedDate(null);
      setSelectedClient(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error scheduling date:', error);
      setError('Failed to schedule date');
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasSchedule = scheduledDates.some(scheduledDate => 
        scheduledDate.toDateString() === date.toDateString()
      );
      
      return hasSchedule ? (
        <div className="h-2 w-2 bg-indigo-600 rounded-full mx-auto mt-1"></div>
      ) : null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Current Tasks</h1>
        <p className="text-gray-600">Manage and assign tasks to adjusters</p>
      </div>

      {/* Calendar Button */}
      <button
        onClick={() => setShowCalendarModal(true)}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
      >
        Open Schedule Calendar
      </button>

      {/* Clients List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map(client => (
          <div key={client._id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {client.insured.insuredFirstName} {client.insured.insuredLastName}
                </h3>
                <p className="text-sm text-gray-500">Claim #{client.claim.claimNumber}</p>
              </div>
              <select
                value={client.assignedTo || ''}
                onChange={(e) => handleAdjusterSelect(client._id, e.target.value)}
                className="ml-4 px-3 py-1 border rounded-md text-sm"
              >
                <option value="">Assign Adjuster</option>
                {adjusters.map(adjuster => (
                  <option key={adjuster._id} value={adjuster._id}>
                    {adjuster.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> {client.insured.email}</p>
              <p><span className="font-medium">Phone:</span> {client.insured.primaryPhone}</p>
              <p><span className="font-medium">Address:</span> {client.insured.street}</p>
              <p><span className="font-medium">Date of Loss:</span> {new Date(client.claim.dateOfLoss).toLocaleDateString()}</p>
              {client.scheduledDate && (
                <p className="text-indigo-600">
                  <span className="font-medium">Scheduled:</span> {new Date(client.scheduledDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Modal */}
      <Modal isOpen={showCalendarModal} onClose={() => setShowCalendarModal(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Schedule Tasks</h2>
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileContent={tileContent}
            minDate={new Date()}
            className="rounded-lg border shadow-sm"
          />
        </div>
      </Modal>

      {/* Client Selection Modal */}
      <Modal isOpen={showClientModal} onClose={() => setShowClientModal(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Client</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {clients.map(client => (
              <div
                key={client._id}
                onClick={() => handleClientSelect(client)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <p className="font-medium">{client.insured.insuredFirstName} {client.insured.insuredLastName}</p>
                <p className="text-sm text-gray-500">Claim #{client.claim.claimNumber}</p>
                <p className="text-sm text-gray-500">{client.insured.email}</p>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Confirm Schedule</h2>
          {selectedClient && (
            <div className="space-y-4">
              <p>Are you sure you want to schedule an appointment for:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{selectedClient.insured.insuredFirstName} {selectedClient.insured.insuredLastName}</p>
                <p className="text-sm text-gray-500">Claim #{selectedClient.claim.claimNumber}</p>
                <p className="text-sm text-gray-500">
                  Date: {selectedDate?.toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CurrentTasks; 
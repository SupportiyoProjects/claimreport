import React, { useState, useEffect } from 'react';
import { getAdjusters, updateAdjusterStatus } from '../services/api';
import Modal from './Modal';

const InactiveAdjusters = () => {
  const [inactiveAdjusters, setInactiveAdjusters] = useState([]);
  const [selectedAdjuster, setSelectedAdjuster] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInactiveAdjusters();
  }, []);

  const fetchInactiveAdjusters = async () => {
    try {
      const response = await getAdjusters();
      const inactive = response.data.filter(adjuster => adjuster.status === 'inactive');
      setInactiveAdjusters(inactive);
    } catch (error) {
      console.error('Error fetching inactive adjusters:', error);
    }
  };

  const handleAdjusterSelect = (e) => {
    const adjuster = inactiveAdjusters.find(adj => adj._id === e.target.value);
    setSelectedAdjuster(adjuster);
    setIsModalOpen(true);
  };

  const handleActivateAdjuster = async () => {
    if (!selectedAdjuster) return;

    setLoading(true);
    try {
      await updateAdjusterStatus(selectedAdjuster._id, 'active');
      await fetchInactiveAdjusters(); // Refresh the list
      setIsModalOpen(false);
      setSelectedAdjuster(null);
    } catch (error) {
      console.error('Error activating adjuster:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="inactiveAdjusters" className="block text-sm font-medium text-gray-700 mb-2">
          Select Inactive Adjuster
        </label>
        <select
          id="inactiveAdjusters"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={handleAdjusterSelect}
          value={selectedAdjuster?._id || ''}
        >
          <option value="">Select an adjuster</option>
          {inactiveAdjusters.map((adjuster) => (
            <option key={adjuster._id} value={adjuster._id}>
              {adjuster.name} ({adjuster.email})
            </option>
          ))}
        </select>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Activate Adjuster
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to activate {selectedAdjuster?.name}? This will allow them to be assigned to new cases.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleActivateAdjuster}
              disabled={loading}
            >
              {loading ? 'Activating...' : 'Activate'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InactiveAdjusters; 
import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Sidebar from '../../components/Sidebar';
import CreateAdjuster from './CreateAdjuster';
import CurrentTasks from './CurrentTasks';
import CompletedTasks from './CompletedTasks';
import AllocateTasks from './AllocateTasks';
import AdjustersList from './AdjustersList';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [refreshAdjusters, setRefreshAdjusters] = useState(0);

  const handleAdjusterCreated = () => {
    setRefreshAdjusters(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'current':
        return <CurrentTasks />;
      case 'completed':
        return <CompletedTasks />;
      case 'allocate':
        return <AllocateTasks />;
      case 'adjusters':
        return <AdjustersList key={refreshAdjusters} />;
      default:
        return <CurrentTasks />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="lg:ml-64 min-h-screen">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Create Adjuster
            </button>
          </div>

          {renderContent()}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateAdjuster 
          onClose={() => setIsModalOpen(false)} 
          onAdjusterCreated={handleAdjusterCreated}
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
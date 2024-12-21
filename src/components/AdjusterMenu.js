import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const AdjusterMenu = ({ activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/adjuster' },
    { id: 'tasks', label: 'Tasks', path: '/adjuster/tasks' },
    { id: 'completedTasks', label: 'Completed Tasks', path: '/adjuster/completed-tasks' },
  ];

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none"
        >
          {isMobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Adjuster Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-50 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-600">Adjuster Dashboard</h1>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleMenuClick(item.id)}
                className={`block w-full px-4 py-2 text-left rounded-md transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdjusterMenu; 
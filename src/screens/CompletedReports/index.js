import React from 'react';
import Navbar from '../../components/layout/Navbar';

export default function CompletedReports() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Completed Reports</h1>
        {/* Add your completed reports list here */}
      </main>
    </div>
  );
} 
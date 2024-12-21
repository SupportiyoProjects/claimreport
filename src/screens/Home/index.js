import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [totalCount, setTotalCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const email = 'aliyanamir15@gmail.com';


  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        // Fetch total count of clients
        const response = await axios.get('http://localhost:5000/api/client/count');
        setTotalCount(response.data.count);

        // Fetch count for specific email
        const userResponse = await axios.get(`http://localhost:5000/api/client/count/${email}`);
        setUserCount(userResponse.data.count);
      } catch (error) {
        console.error("Error fetching total client count:", error);
      }
    };

    fetchTotalCount();
  }, []);

  const buttons = [
    {
      title: "Make a New Report",
      description: "Create and submit a new claim report",
      path: "/insured-information",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to ClaimReport</h1>
          <p className="text-lg text-gray-600">What would you like to do today?</p>
        </div>
        
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Existing Reports</h2>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-gray-600">
              Total reports in the system: {totalCount}
            </p>
            <p className="text-gray-600">
              Your reports: {userCount}
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-1 gap-6 mt-6">
          {buttons.map((button, index) => (
            <motion.div
              key={button.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(button.path)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-2 cursor-pointer border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                  {button.icon}
                </div>
                <h2 className="text-sm font-semibold text-gray-900 mb-1">{button.title}</h2>
                <p className="text-gray-500 text-xs">{button.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

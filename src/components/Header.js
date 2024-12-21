import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="flex">
      <aside className="bg-indigo-600 text-white w-64 min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Claim Management System</h1>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/" className="block p-2 hover:bg-indigo-700 rounded">Home</Link>
            </li>
            <li className="mb-2">
              <Link to="/clients" className="block p-2 hover:bg-indigo-700 rounded">Clients</Link>
            </li>
            <li className="mb-2">
              <Link to="/adjusters" className="block p-2 hover:bg-indigo-700 rounded">Adjusters</Link>
            </li>
            <li className="mb-2">
              <Link to="/tasks" className="block p-2 hover:bg-indigo-700 rounded">Allocate Tasks</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {/* This is where the main content will be rendered */}
      </main>
    </div>
  );
};

export default Header; 
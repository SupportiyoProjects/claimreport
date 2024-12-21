import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './screens/SignIn';
import AdminDashboard from './screens/admin/AdminDashboard';
import CurrentTasks from './screens/admin/CurrentTasks';
import CompletedTasks from './screens/admin/CompletedTasks';
import AllocateTasks from './screens/admin/AllocateTasks';

import CreateAdjuster from './screens/admin/CreateAdjuster';
import Tasks from './screens/Adjuster/Tasks';
import CompletedTasksAdjuster from './screens/Adjuster/CompletedTasks';
import AdjusterDashboard from './screens/Adjuster/AdjusterDashboard';
import { FormProvider } from './screens/context/index';
import InsuredInformation from '../src/screens/InsuredInformation';
import ClaimDetails from '../src/screens/ClaimDetails';
import Home from './screens/Home';


function App() {
  return (
    <BrowserRouter>
      <FormProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/current-tasks" element={<CurrentTasks />} />
          <Route path="/admin/completed-tasks" element={<CompletedTasks />} />
          <Route path="/admin/allocate-tasks" element={<AllocateTasks />} />
          <Route path='/client-home' element={<Home/>}/>
          <Route path="/insured-information" element={<InsuredInformation />} />
          <Route path="/claim-details" element={<ClaimDetails />} />
          <Route path="/admin/create-adjuster" element={<CreateAdjuster />} />
          <Route path="/adjuster" element={<AdjusterDashboard />}>
            <Route path="tasks" element={<Tasks />} />
            <Route path="completed-tasks" element={<CompletedTasksAdjuster />} />
          </Route>
        </Routes>
      </FormProvider>
    </BrowserRouter>
  );
}

export default App;

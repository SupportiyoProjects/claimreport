import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './screens/auth/SignIn';
import SignUp from './screens/auth/SignUp';
import Home from './screens/Home';
import NewReport from './screens/NewReport';
import CurrentStatus from './screens/CurrentStatus';
import CompletedReports from './screens/CompletedReports';

const CLERK_PUBLISHABLE_KEY = "pk_test_bWVldC13aGlwcGV0LTMyLmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/new-report" element={<NewReport />} />
          <Route path="/current-status" element={<CurrentStatus />} />
          <Route path="/completed-reports" element={<CompletedReports />} />
          <Route path="/" element={<Navigate to="/sign-in" />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App; 
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './screens/auth/SignIn';
import SignUp from './screens/auth/SignUp';

// Hardcoded publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_bWVldC13aGlwcGV0LTMyLmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App; 
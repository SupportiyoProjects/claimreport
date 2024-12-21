import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './screens/auth/SignIn';
import SignUp from './screens/auth/SignUp';
import Home from './screens/Home';
import NewReport from './screens/NewReport';
import CurrentStatus from './screens/CurrentStatus';
import CompletedReports from './screens/CompletedReports';
import InsuredInformation from './screens/InsuredInformation';
import ClaimDetails from './screens/ClaimDetails';
import { FormProvider } from './screens/context/index';

const CLERK_PUBLISHABLE_KEY = "pk_test_bWVldC13aGlwcGV0LTMyLmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <FormProvider>
          <Routes>

            {/* <Route path="/sign-in" element={<Home />} /> */}
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            {/* <Route path="/new-report" element={<NewReport />} /> */}
            <Route path="/current-status" element={<CurrentStatus />} />
            <Route path="/completed-reports" element={<CompletedReports />} />
            <Route path="/insured-information" element={<InsuredInformation />} />
            <Route path="/claim-details" element={<ClaimDetails />} />
            <Route path="/" element={<Navigate to="/home" replace />} />

          </Routes>
        </FormProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App; 
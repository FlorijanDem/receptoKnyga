import { Suspense, useContext, useEffect } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Layout from "./components/layout/Layout";
import UserContextProvider from "./contexts/UserContextProvider";
import UserContext from "./contexts/UserContext";
import GuestLayout from "./components/layout/GuestLayout";
import ResetPassword from "./components/ResetPassword";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { SearchProvider } from "./contexts/SearchContext";
import { Routes, Route, useLocation } from "react-router";
import { logPageView } from "./contexts/LoggingContext";
import { AdminFilterContextProvider } from "./contexts/AdminFilterContext";

function AppContent() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      logPageView(location.pathname);
    }
  }, [location, user]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/*" element={user ? <Layout /> : <GuestLayout />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UserContextProvider>
          <AdminFilterContextProvider>
            <SearchProvider>
              <AppContent />
            </SearchProvider>
          </AdminFilterContextProvider>
        </UserContextProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;

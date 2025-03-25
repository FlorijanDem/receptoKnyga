import { Suspense, useContext } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Layout from "./components/layout/Layout";
import UserContextProvider from "./contexts/UserContextProvider";
import UserContext from "./contexts/UserContext";
import GuestLayout from "./components/layout/GuestLayout";
import ResetPassword from "./components/ResetPassword";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { SearchProvider } from "./contexts/SearchContext";
<<<<<<< HEAD
import { Routes, Route } from "react-router";
=======
>>>>>>> 05b6ea2 (Add admin navigation)
import { AdminFilterContextProvider } from "./contexts/AdminFilterContext";

function AppContent() {
  const { user } = useContext(UserContext);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
        <Route
          path="/*"
          element={user ? <Layout /> : <GuestLayout />}
        />
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

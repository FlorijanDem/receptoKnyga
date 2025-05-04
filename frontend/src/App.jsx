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
import { Routes, Route } from "react-router";
import { AdminFilterContextProvider } from "./contexts/AdminFilterContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";

function AppContent() {
  const { user } = useContext(UserContext);
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
              <FavoritesProvider>
                <AppContent />
              </FavoritesProvider>
            </SearchProvider>
          </AdminFilterContextProvider>
        </UserContextProvider>
      </ErrorBoundary>
    </>
  );
}
export default App;

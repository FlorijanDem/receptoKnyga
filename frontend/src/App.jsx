import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useContext } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Layout from "./components/layout/Layout";
import UserContextProvider from "./contexts/UserContextProvider";
import UserContext from "./contexts/UserContext";
import GuestLayout from "./components/layout/GuestLayout";
import { SearchProvider } from "./contexts/SearchContext";

function AppContent() {
  const { user } = useContext(UserContext);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {user ? <Layout /> : <GuestLayout />}
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserContextProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </UserContextProvider>
    </ErrorBoundary>
  );
}

export default App;

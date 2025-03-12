import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Layout from "./components/layout/Layout";
import UserContextProvider from "./contexts/UserContextProvider";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserContextProvider>
        <SearchProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Layout/>
          </Suspense>
        </SearchProvider>
      </UserContextProvider>
    </ErrorBoundary>
  );
}

export default App;

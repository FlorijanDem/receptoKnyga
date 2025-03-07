import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Layout from "./components/layout/Layout";
import UserContextProvider from "./contexts/UserContextProvider";


function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserContextProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout/>
        </Suspense>
      </UserContextProvider>
    </ErrorBoundary>
  );
}

export default App;

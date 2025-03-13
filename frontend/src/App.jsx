import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import ErrorFallback from "./components/ErrorFallback";
import Layout from "./components/layout/Layout";
import UserContextProvider from "./contexts/UserContextProvider";

function App() {
  return (
    <>
      <Toaster />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UserContextProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Layout />
          </Suspense>
        </UserContextProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;

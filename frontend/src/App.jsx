import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Main from "./components/Main";
import Footer from "./components/Footer";
import UserContextProvider from "./contexts/UserContextProvider";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UserContextProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Main />
          <Footer />
        </Suspense>
      </UserContextProvider>
    </ErrorBoundary>
  );
}

export default App;

import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import WelcomePage from "./Pages/WelcomePage";
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <WelcomePage></WelcomePage>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

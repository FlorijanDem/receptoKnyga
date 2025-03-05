import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import { Route, Routes } from "react-router";

import Login from "./Pages/LoginPage";
import WelcomePage from "./Pages/WelcomePage";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="Login" element={<Login />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

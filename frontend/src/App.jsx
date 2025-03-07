import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Route, Routes } from "react-router";
import ErrorFallback from "./components/ErrorFallback";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Header /> */}
        {/* {<Main /> */}
        {/* <Footer /> */}

        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

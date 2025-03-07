import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Nav from "./components/Navigation";


function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Nav />
        <Main />
        <Footer />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

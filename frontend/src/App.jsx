import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Layout from "./components/layout/Layout";
import UserContextProvider from "./contexts/UserContextProvider";
import { SearchProvider } from "./contexts/SearchContext";
import React, { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import SignInForm from "./components/SingInForm";

function App() {
  const [isLogin, setIsLogin] = useState(true); // state to toggle between Login and Sign Up

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState); // Toggle between Login and Sign Up forms
  };
  return (
    <>
      <div className="papa">
        {isLogin ? (
          <LoginForm toggleForm={toggleForm} />
        ) : (
          <SignInForm toggleForm={toggleForm} />
        )}
      </div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UserContextProvider>
          <SearchProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Layout />
            </Suspense>
          </SearchProvider>
        </UserContextProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;

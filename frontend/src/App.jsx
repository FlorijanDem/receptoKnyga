import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import ErrorFallback from "./components/ErrorFallback";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Favourite from "./navBarPages/Favourite";
import Profile from "./navBarPages/Profile";
import Settings from "./navBarPages/Settings";
import ShoppingList from "./navBarPages/ShoppingList";
import { Routes, Route } from "react-router";
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/shoppingList" element={<ShoppingList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
        <Header />
        <Main />
        <Footer />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

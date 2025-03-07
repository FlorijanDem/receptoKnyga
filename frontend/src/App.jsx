import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Route, Routes } from "react-router";
import ErrorFallback from "./components/ErrorFallback";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

import FavouritePage from "./pages/FavouritePage";
import ProfilePage from "./pages/ProfilePage";
import SettingPage from "./pages/SettingsPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        {/* {<Main /> */}
        <Footer />

        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Temp homepage route */}
          <Route path="/Favourite" element={<FavouritePage />} />
          <Route path="/Settings" element={<SettingPage />} />
          <Route path="/ShoppingList" element={<ShoppingListPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

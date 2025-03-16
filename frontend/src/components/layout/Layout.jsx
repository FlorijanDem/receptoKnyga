import Footer from "../Footer";
import Nav from "../Navigation";
import Home from "../Home";
import { LoginForm } from "../LoginForm";
import SignInForm from "../SingInForm";
import RecipePage from "../RecipePage";
import Favourite from "../../navBarPages/Favourite";
import Profile from "../../navBarPages/Profile";
import Settings from "../../navBarPages/Settings";
import ShoppingList from "../../navBarPages/ShoppingList";
import { Routes, Route, useLocation } from "react-router";

function Layout() {
  const location = useLocation();

  // Hide Nav on Login & Register pages
  const hideNav =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNav && <Nav />} {/* Conditionally render Nav */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<LoginForm />} /> */}
        <Route path="/register" element={<SignInForm />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/shoppingList" element={<ShoppingList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}
export default Layout;

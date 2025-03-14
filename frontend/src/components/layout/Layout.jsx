import Footer from "../Footer";
import Nav from "../Navigation";
import Home from "../Home";
import RecipePage from "../RecipePage";
import Favourite from "../../navBarPages/Favourite";
import Profile from "../../navBarPages/Profile";
import Settings from "../../navBarPages/Settings";
import ShoppingList from "../../navBarPages/ShoppingList";
import { Routes, Route } from "react-router";
import { SearchProvider } from "../../contexts/SearchContext";
import AddRecipe from "../AddRecipe";

function Layout() {
  return (
    <>
      <SearchProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/shoppingList" element={<ShoppingList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
        </Routes>
      </SearchProvider>
      <Footer />
    </>
  );
}
export default Layout;
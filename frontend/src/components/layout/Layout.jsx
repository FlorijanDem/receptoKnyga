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
import Dashboard from "../../navBarPages/Dashboard";
import UsersList from "../UsersList";
import ReviewsList from "../ReviewsList";
import UserRecipesList from "../UserRecipesList";

function Layout() {
  return (
    <>
      <SearchProvider>
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/reviews" element={<ReviewsList />} />

            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/favourite" element={<Favourite />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shoppingList" element={<ShoppingList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addRecipe" element={<AddRecipe />} />
            <Route path="/editRecipe" element={<AddRecipe action="edit" />} />
            <Route path="/myrecipes" element={<UserRecipesList />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </SearchProvider>
      <Footer />
    </>
  );
}
export default Layout;

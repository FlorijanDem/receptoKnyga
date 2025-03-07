import { Route, Routes } from "react-router";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import RecipePage from "./RecipePage";
import Favourite from "../navBarPages/Favourite";
import Profile from "../navBarPages/Profile";
import Settings from "../navBarPages/Settings";
import ShoppingList from "../navBarPages/ShoppingList";
const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe/:id" element={<RecipePage/>}/>
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/shoppingList" element={<ShoppingList />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </main>
  );
};

export default Main;

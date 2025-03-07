import { Route, Routes } from "react-router";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import RecipePage from "./RecipePage";


const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipe/:id" element={<RecipePage/>}/>
      </Routes>
    </main>
  );
};

export default Main;

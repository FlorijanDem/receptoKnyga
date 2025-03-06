import { Route, Routes } from "react-router";
import Home from "./Home";
import RecipePage from "./RecipePage";

const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipePage/>}/>
      </Routes>
    </main>
  );
};

export default Main;

import { Route, Routes } from "react-router";
import Home from "./Home";

const Main = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </main>
  );
};

export default Main;

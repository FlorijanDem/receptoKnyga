import Footer from "../Footer";
import Login from "../Login";
import Register from "../Register";
import WelcomePage from "../WelcomePage";
import { Routes, Route } from "react-router";
function GuestLayout() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
export default GuestLayout;

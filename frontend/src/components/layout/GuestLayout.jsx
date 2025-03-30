import Footer from "../Footer";
import Login from "../Login";
import Register from "../Register";
import WelcomePage from "../WelcomePage";
import { Routes, Route } from "react-router";
import ForgotPassword from "../ForgotPassword";
function GuestLayout() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
export default GuestLayout;

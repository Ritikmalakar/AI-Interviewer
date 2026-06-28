import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserRoutes from "./routes/UserRoutes";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

import Interview from "./pages/Interview";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route element={<UserRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/interview" element={<Interview />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/user/Login";
import Home from "./../../vite-react/src/pages/Home";
import Signup from "./pages/user/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;

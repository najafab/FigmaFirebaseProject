import React from "react";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Products from "./Components/Products";
import UpdatePro from "./Components/UpdatePro"; // Make sure the path is correct
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/update/:id" element={<UpdatePro />} />
        {/* Add ProfilePicture route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import About from "./pages/About";
import Contact from "./pages/Contact";

function AppWrapper() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth route */}
        <Route path="/login" element={<Login />} />

        {/* Informational pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected / app pages (render TopBar inside those pages) */}
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppWrapper;

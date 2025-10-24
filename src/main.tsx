import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App";
import Men from "./pages/Men";
import Buy from "./pages/Buy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { CartProvider } from "./pages/cart";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Men />} />
          <Route path="/kids" element={<Men />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);

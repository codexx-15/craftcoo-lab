import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import { Header } from "./components/Header";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Footer } from "./components/Footer";
import ChatBot from "./components/ChatBot";

// Pages
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";
import WishlistPage from "./pages/WishlistPage";
import CustomPaintingPage from "./pages/CustomPaintingPage";
import StorePage from "./pages/StorePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

const ProtectedRoute = ({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;
  if (!userInfo) return <Navigate to="/login" />;
  if (isAdmin && !userInfo.isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen bg-[#fdfbfb] relative overflow-hidden">
        
        {/* Grain texture overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Main Content */}
        <div className="relative z-10">

          <AnnouncementBar />
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/custom-paintings" element={<CustomPaintingPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/admin" element={<ProtectedRoute isAdmin={true}><AdminPage /></ProtectedRoute>} />
          </Routes>

          <Footer />
          <ChatBot />
        </div>
      </div>
        </CartProvider>
      </WishlistProvider>
    </Router>
  );
}

export default App;

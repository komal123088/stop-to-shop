import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";

// Admin pages
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import AddEditProduct from "./admin/pages/AddEditProduct";
import Categories from "./admin/pages/Categories";
import Orders from "./admin/pages/Orders";
import Users from "./admin/pages/Users";

// Public pages
import IntroAnimation from "./components/IntroAnimation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Shop from "./pages/Shop";
import "./styles/theme.css";

const PublicSite = () => {
  const [showIntro, setShowIntro] = useState(true);
  if (showIntro) return <IntroAnimation onFinish={() => setShowIntro(false)} />;
  return (
    <div className="app">
      <Navbar />
      <Landing />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicSite />} />
            <Route
              path="/shop"
              element={
                <>
                  <Navbar />
                  <Shop />
                  <Footer />
                </>
              }
            />

            {/* Admin */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/add" element={<AddEditProduct />} />
              <Route path="products/edit/:id" element={<AddEditProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
